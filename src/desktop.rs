use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> crate::Result<Shellx<R>> {
    Ok(Shellx(app.clone()))
}

/// Access to the shellx APIs.
pub struct Shellx<R: Runtime>(AppHandle<R>);
