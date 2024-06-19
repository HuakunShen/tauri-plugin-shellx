const COMMANDS: &[&str] = &[
    "execute",
    "spawn",
    "stdin_write",
    "kill",
    "open",
    "fix_path_env",
];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        // .android_path("android")
        // .ios_path("ios")
        .build();
}
