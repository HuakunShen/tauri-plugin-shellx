const COMMANDS: &[&str] = &["execute", "spawn", "stdin_write", "kill", "open"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        // .android_path("android")
        // .ios_path("ios")
        .build();
}
