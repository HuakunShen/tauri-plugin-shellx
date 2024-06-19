# Tauri Plugin Shellx

This is a modified version of the official Tauri plugin [tauri-plugin-shell](https://github.com/tauri-apps/tauri-plugin-shell).

The purpose is to remove restrictions on shell commands (every command has to be pre-defined in capability).

This plugin allows you to execute any shell commands freely without any restrictions.

## Docs

JS/TS API Documentation: https://huakunshen.github.io/tauri-plugin-shellx/

## Usage

Install rust crate from https://crates.io/crates/tauri-plugin-shellx

Init plugin like this. The `init()` function takes a single unlocked argument.

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_shellx::init(true))
...
```

If set to true, capability and permission settings are ignored.

If set to false, it will work like the original `tauri-plugin-shell`.

## Example

An example app can be found at [./examples/tauri-app](./examples/tauri-app).
