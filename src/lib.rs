use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

use std::{collections::HashMap, sync::Mutex};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Shellx;
#[cfg(mobile)]
use mobile::Shellx;

#[derive(Default)]
struct MyState(Mutex<HashMap<String, String>>);

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the shellx APIs.
pub trait ShellxExt<R: Runtime> {
  fn shellx(&self) -> &Shellx<R>;
}

impl<R: Runtime, T: Manager<R>> crate::ShellxExt<R> for T {
  fn shellx(&self) -> &Shellx<R> {
    self.state::<Shellx<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("shellx")
    .invoke_handler(tauri::generate_handler![commands::execute])
    .setup(|app, api| {
      #[cfg(mobile)]
      let shellx = mobile::init(app, api)?;
      #[cfg(desktop)]
      let shellx = desktop::init(app, api)?;
      app.manage(shellx);

      // manage state so it is accessible by the commands
      app.manage(MyState::default());
      Ok(())
    })
    .build()
}
