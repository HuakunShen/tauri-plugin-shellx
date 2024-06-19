/**
 * This module provides utilities for running shell scripts.
 * You can always construct your own shell script, but these functions
 * provide a convenient way to run common shell scripts.
 */
import { Command } from './command'
import { ChildProcess } from './types'

// Make Scripts Commands
export function makeBashScript(script: string): Command<string> {
  return Command.create('bash', ['-c', script])
}

export function makePowershellScript(script: string): Command<string> {
  return Command.create('powershell', ['-Command', script])
}

export function makeAppleScript(script: string): Command<string> {
  return Command.create('osascript', ['-e', script])
}

// Execute Scripts (Returns when the script is done executing)
export async function executeBashScript(
  script: string
): Promise<ChildProcess<string>> {
  const cmd = makeBashScript(script)
  return await cmd.execute()
}

export async function executePowershellScript(
  script: string
): Promise<ChildProcess<string>> {
  const cmd = makePowershellScript(script)
  return await cmd.execute()
}

export async function executeAppleScript(
  script: string
): Promise<ChildProcess<string>> {
  const cmd = makeAppleScript(script)
  return await cmd.execute()
}
