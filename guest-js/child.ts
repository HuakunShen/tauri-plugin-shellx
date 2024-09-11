import { invoke } from '@tauri-apps/api/core'
import { IOPayload } from './types'

/**
 * @since 2.0.0
 */
export class Child {
  /** The child process `pid`. */
  pid: number

  constructor(pid: number) {
    this.pid = pid
  }

  /**
   * Writes `data` to the `stdin`.
   *
   * @param data The message to write, either a string or a byte array.
   * @example
   * ```typescript
   * import { Command } from '@tauri-apps/plugin-shell';
   * const command = Command.create('node');
   * const child = await command.spawn();
   * await child.write('message');
   * await child.write([0, 1, 2, 3, 4, 5]);
   * ```
   *
   * @returns A promise indicating the success or failure of the operation.
   *
   * @since 2.0.0
   */
  async write(data: IOPayload | number[]): Promise<void> {
    await invoke('plugin:shellx|stdin_write', {
      pid: this.pid,
      buffer: data
    })
  }

  /**
   * Kills the child process.
   *
   * @returns A promise indicating the success or failure of the operation.
   *
   * @since 2.0.0
   */
  async kill(): Promise<void> {
    await invoke('plugin:shellx|kill', {
      cmd: 'killChild',
      pid: this.pid
    })
  }
}
