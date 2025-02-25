const COMMANDS: &[&str] = &[
    "execute",
    "spawn",
    "stdin_write",
    "kill",
    "kill_pid",
    "open",
    "fix_path_env",
    "where_is_command",
];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        // .android_path("android")
        // .ios_path("ios")
        .build();
}
