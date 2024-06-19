import { invoke } from "@tauri-apps/api/core";
export { Child } from "./child";
export { Command } from "./command";
export { EventEmitter } from "./event";
export type * from "./types";

/**
 * Opens a path or URL with the system's default app,
 * or the one specified with `openWith`.
 *
 * The `openWith` value must be one of `firefox`, `google chrome`, `chromium` `safari`,
 * `open`, `start`, `xdg-open`, `gio`, `gnome-open`, `kde-open` or `wslview`.
 *
 * @example
 * ```typescript
 * import { open } from '@tauri-apps/plugin-shell';
 * // opens the given URL on the default browser:
 * await open('https://github.com/tauri-apps/tauri');
 * // opens the given URL using `firefox`:
 * await open('https://github.com/tauri-apps/tauri', 'firefox');
 * // opens a file using the default program:
 * await open('/path/to/file');
 * ```
 *
 * @param path The path or URL to open.
 * This value is matched against the string regex defined on `tauri.conf.json > plugins > shell > open`,
 * which defaults to `^((mailto:\w+)|(tel:\w+)|(https?://\w+)).+`.
 * @param openWith The app to open the file or URL with.
 * Defaults to the system default application for the specified path type.
 *
 * @since 2.0.0
 */
export function open(path: string, openWith?: string) {
  return invoke<void>("plugin:shellx|open", {
    path,
    with: openWith,
  });
}

export function fixPathEnv() {
  return invoke<void>("plugin:shellx|fix_path_env");
}
