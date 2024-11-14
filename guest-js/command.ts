import { Channel, invoke } from '@tauri-apps/api/core'
import { Child } from './child'
import {
  ChildProcess,
  CommandEvent,
  CommandEvents,
  InternalSpawnOptions,
  IOPayload,
  OutputEvents,
  SpawnOptions
} from './types'
import { EventEmitter } from './event'

/**
 * The entry point for spawning child processes.
 * It emits the `close` and `error` events.
 * @example
 * ```typescript
 * import { Command } from '@tauri-apps/plugin-shell';
 * const command = Command.create('node');
 * command.on('close', data => {
 *   console.log(`command finished with code ${data.code} and signal ${data.signal}`)
 * });
 * command.on('error', error => console.error(`command error: "${error}"`));
 * command.stdout.on('data', line => console.log(`command stdout: "${line}"`));
 * command.stderr.on('data', line => console.log(`command stderr: "${line}"`));
 *
 * const child = await command.spawn();
 * console.log('pid:', child.pid);
 * ```
 *
 * @since 2.0.0
 *
 */
export class Command<O extends IOPayload> extends EventEmitter<CommandEvents> {
  /** @ignore Program to execute. */
  readonly program: string
  /** @ignore Program arguments */
  readonly args: string[]
  /** @ignore Spawn options. */
  readonly options: InternalSpawnOptions
  /** Event emitter for the `stdout`. Emits the `data` event. */
  readonly stdout = new EventEmitter<OutputEvents<O>>()
  /** Event emitter for the `stderr`. Emits the `data` event. */
  readonly stderr = new EventEmitter<OutputEvents<O>>()

  /**
   * @ignore
   * Creates a new `Command` instance.
   *
   * @param program The program name to execute.
   * It must be configured on `tauri.conf.json > plugins > shell > scope`.
   * @param args Program arguments.
   * @param options Spawn options.
   */
  constructor(
    program: string,
    args: string | string[] = [],
    options?: SpawnOptions
  ) {
    super()
    this.program = program
    this.args = typeof args === 'string' ? [args] : args
    this.options = options ?? {}
  }

  static create(program: string, args?: string | string[]): Command<string>
  static create(
    program: string,
    args?: string | string[],
    options?: SpawnOptions & { encoding: 'raw' }
  ): Command<Uint8Array>
  static create(
    program: string,
    args?: string | string[],
    options?: SpawnOptions
  ): Command<string>

  /**
   * Creates a command to execute the given program.
   * @example
   * ```typescript
   * import { Command } from '@tauri-apps/plugin-shell';
   * const command = Command.create('my-app', ['run', 'tauri']);
   * const output = await command.execute();
   * ```
   *
   * @param program The program to execute.
   * It must be configured on `tauri.conf.json > plugins > shell > scope`.
   */
  static create<O extends IOPayload>(
    program: string,
    args: string | string[] = [],
    options?: SpawnOptions
  ): Command<O> {
    return new Command(program, args, options)
  }

  static sidecar(program: string, args?: string | string[]): Command<string>
  static sidecar(
    program: string,
    args?: string | string[],
    options?: SpawnOptions & { encoding: 'raw' }
  ): Command<Uint8Array>
  static sidecar(
    program: string,
    args?: string | string[],
    options?: SpawnOptions
  ): Command<string>

  /**
   * Creates a command to execute the given sidecar program.
   * @example
   * ```typescript
   * import { Command } from '@tauri-apps/plugin-shell';
   * const command = Command.sidecar('my-sidecar');
   * const output = await command.execute();
   * ```
   *
   * @param program The program to execute.
   * It must be configured on `tauri.conf.json > plugins > shell > scope`.
   */
  static sidecar<O extends IOPayload>(
    program: string,
    args: string | string[] = [],
    options?: SpawnOptions
  ): Command<O> {
    const instance = new Command<O>(program, args, options)
    instance.options.sidecar = true
    return instance
  }

  /**
   * Executes the command as a child process, returning a handle to it.
   *
   * @returns A promise resolving to the child process handle.
   *
   * @since 2.0.0
   */
  async spawn(): Promise<Child> {
    const program = this.program
    const args = this.args
    const options = this.options

    if (typeof args === 'object') {
      Object.freeze(args)
    }

    const onEvent = new Channel<CommandEvent<O>>()
    onEvent.onmessage = (event) => {
      switch (event.event) {
        case 'Error':
          this.emit('error', event.payload)
          break
        case 'Terminated':
          this.emit('close', event.payload)
          break
        case 'Stdout':
          this.stdout.emit('data', event.payload)
          break
        case 'Stderr':
          this.stderr.emit('data', event.payload)
          break
      }
    }

    return await invoke<number>('plugin:shellx|spawn', {
      program,
      args,
      options,
      onEvent
    }).then((pid) => new Child(pid))
  }

  /**
   * Executes the command as a child process, waiting for it to finish and collecting all of its output.
   * @example
   * ```typescript
   * import { Command } from '@tauri-apps/plugin-shell';
   * const output = await Command.create('echo', 'message').execute();
   * assert(output.code === 0);
   * assert(output.signal === null);
   * assert(output.stdout === 'message');
   * assert(output.stderr === '');
   * ```
   *
   * @returns A promise resolving to the child process output.
   *
   * @since 2.0.0
   */
  async execute(): Promise<ChildProcess<O>> {
    const program = this.program
    const args = this.args
    const options = this.options

    if (typeof args === 'object') {
      Object.freeze(args)
    }

    return invoke<ChildProcess<O>>('plugin:shellx|execute', {
      program,
      args,
      options
    })
  }
}

export function whereIsCommand(cmd: string): Promise<string> {
  return invoke<string>('plugin:shellx|where_is_command', { cmd })
}
