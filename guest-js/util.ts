import { Command, whereIsCommand } from './command'

/**
 * Run powershell.exe -Command 'echo $env:OS' to determine if the current platform is likely to be Windows.
 * Not 100% accurate. If a Mac or Linux somehow has powershell.exe in PATH, this will return true.
 * @returns Whether the current platform is likely to be Windows.
 */
export function likelyOnWindows(): Promise<boolean> {
  return Command.create('powershell.exe', ['-Command', 'echo $env:OS'])
    .execute()
    .then(
      (out) => out.code === 0 && out.stdout.toLowerCase().includes('windows')
    )
    .catch(() => false)
}

/**
 * Determine if a command is available with `which` or `where` command.
 * Support Windows, Mac, Linux
 * @param command
 * @returns
 */
export async function hasCommand(command: string): Promise<boolean> {
  return whereIsCommand(command).then((path) => !!path && path.length > 0)
}
