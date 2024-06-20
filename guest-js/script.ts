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

export function makePythonScript(script: string): Command<string> {
  return Command.create('python', ['-c', script])
}

export function makeZshScript(script: string): Command<string> {
  return Command.create('zsh', ['-c', script])
}

export function makeNodeScript(script: string): Command<string> {
  return Command.create('node', ['-e', script])
}

// Execute Scripts (Returns when the script is done executing)
export async function executeBashScript(
  script: string
): Promise<ChildProcess<string>> {
  return makeBashScript(script).execute()
}

export async function executePowershellScript(
  script: string
): Promise<ChildProcess<string>> {
  return makePowershellScript(script).execute()
}

export async function executeAppleScript(
  script: string
): Promise<ChildProcess<string>> {
  return makeAppleScript(script).execute()
}

export async function executePythonScript(
  script: string
): Promise<ChildProcess<string>> {
  return makePythonScript(script).execute()
}

export async function executeZshScript(
  script: string
): Promise<ChildProcess<string>> {
  return makeZshScript(script).execute()
}

export async function executeNodeScript(
  script: string
): Promise<ChildProcess<string>> {
  return makeNodeScript(script).execute()
}
