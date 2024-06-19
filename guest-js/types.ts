export interface SpawnOptions {
  /** Current working directory. */
  cwd?: string;
  /** Environment variables. set to `null` to clear the process env. */
  env?: Record<string, string>;
  /**
   * Character encoding for stdout/stderr
   *
   * @since 2.0.0
   *  */
  encoding?: string;
}

export interface InternalSpawnOptions extends SpawnOptions {
  sidecar?: boolean;
}

export type IOPayload = string | Uint8Array;

export interface ChildProcess<O extends IOPayload> {
  /** Exit code of the process. `null` if the process was terminated by a signal on Unix. */
  code: number | null;
  /** If the process was terminated by a signal, represents that signal. */
  signal: number | null;
  /** The data that the process wrote to `stdout`. */
  stdout: O;
  /** The data that the process wrote to `stderr`. */
  stderr: O;
}

/**
 * Payload for the `Terminated` command event.
 */
export interface TerminatedPayload {
  /** Exit code of the process. `null` if the process was terminated by a signal on Unix. */
  code: number | null;
  /** If the process was terminated by a signal, represents that signal. */
  signal: number | null;
}

export interface CommandEvents {
  close: TerminatedPayload;
  error: string;
}

/**
 * Describes the event message received from the command.
 */
interface Event<T, V> {
  event: T;
  payload: V;
}

/** Events emitted by the child process. */
export type CommandEvent<O extends IOPayload> =
  | Event<"Stdout", O>
  | Event<"Stderr", O>
  | Event<"Terminated", TerminatedPayload>
  | Event<"Error", string>;

export interface OutputEvents<O extends IOPayload> {
  data: O;
}
