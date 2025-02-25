# Tauri Plugin Shellx

<h3 style="color:red;">Currently this plugin only supports Tauri v2</h3>

[![Deploy Docs](https://github.com/HuakunShen/tauri-plugin-shellx/actions/workflows/docs.yml/badge.svg)](https://github.com/HuakunShen/tauri-plugin-shellx/actions/workflows/docs.yml)

This is a mod of the original official Tauri plugin [tauri-plugin-shell](https://github.com/tauri-apps/tauri-plugin-shell).

The purpose is to provide the option to remove restrictions on shell commands (every command has to be pre-defined in capability).

> [!CAUTION]
> It is not recommended to use this plugin.
> This plugin was created for another project https://github.com/kunkunsh/kunkun, which contains an extension system.
> I implemented a custom permission control layer in JS to ensure security.
> You should use the original shell plugin unless there is a reason you have to unlock the permissions control.

This plugin allows you to execute any shell commands freely without any restrictions.

## Docs

JS/TS API Documentation: https://huakunshen.github.io/tauri-plugin-shellx/

## Installation

- NPM Package: https://www.npmjs.com/package/tauri-plugin-shellx-api
- Rust Crate: https://crates.io/crates/tauri-plugin-shellx

<h4 style="color:red;">Make sure your npm package version and rust crate version are the same, or you may encounter compatibility issues.</h4>

```bash
npm install tauri-plugin-shellx-api
cargo add tauri-plugin-shellx
```

## Usage

Install rust crate from https://crates.io/crates/tauri-plugin-shellx

Init plugin like this. The `init()` function takes a single `unlocked` argument.

```rust
let unlocked = true;
tauri::Builder::default()
    .plugin(tauri_plugin_shellx::init(unlocked))
...
```

- If set to true, capability and permission settings are ignored.
- If set to false, it will work like the original `tauri-plugin-shell`.

## Example

An example app can be found at [./examples/tauri-app](./examples/tauri-app).

This example app is a simplified terminal emulator.

![](./assets/demo.png)

## API

All API functions can be found in the [API documentation](https://huakunshen.github.io/tauri-plugin-shellx/).

### Execute

```ts
const cmd = Command.create('echo', ['echo', 'Hello, World!'])
const out = await cmd.execute()
const stdout = out.stdout
// stdout === 'Hello, World!'
```

### Spawn

Spawn a process for long-running tasks, and get stdout/stderr stream for real-time output.

```ts
const cmd = Command.create('ffmpeg', [
  '-i',
  '/Users/xxx/input.mp4',
  '/Users/xxx/output.mp4'
])

cmd.on('close', (data) => {
  console.log(
    `command finished with code ${data.code} and signal ${data.signal}`
  )
})
cmd.on('error', (error) => console.error(`command error: "${error}"`))
cmd.stdout.on('data', (line) => console.log(`command stdout: "${line}"`))
cmd.stderr.on('data', (line) => console.log(`command stderr: "${line}"`))

const child = await cmd.spawn()
console.log('pid:', child.pid)
await child.kill()
```

### Extra APIs

Except for the original APIs, this plugin also provides some additional APIs:

#### Scripts Wrapper

> These functions are simply wrappers for the `execute` function, which can be used to execute scripts.

You can also construct your own script runner wrapper

```ts
const powershellCmd = Command.create('powershell', ['-Command', script])
const bashCmd = Command.create('bash', ['-c', script])
```

- `makeBashScript`
- `makePowershellScript`
- `makeAppleScript`
- `makePythonScript`
- `makeZshScript`
- `makeNodeScript`
- `executeBashScript`
- `executePowershellScript`
- `executeAppleScript`
- `executePythonScript`
- `executeZshScript`
- `executeNodeScript`

#### Other Utilities

- `likelyOnWindows`
- `hasCommand`
- `fixPathEnv`
  - If the command you run cannot be found in the PATH environment variable, you can use this function to fix it.
