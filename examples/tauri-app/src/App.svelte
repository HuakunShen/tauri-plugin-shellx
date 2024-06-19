<script>
  import { onMount } from "svelte";
  import { Command } from "tauri-plugin-shellx-api";

  onMount(async () => {
    // let result = await Command.create("bash", ["-c", "echo 'hello'"]).execute();
    // console.log(result);
    // console.log(result.stdout);
    let start = Date.now();
    const command = Command.create("ffmpeg", [
      "-i",
      "/Users/hacker/Downloads/video.mp4",
      "-c:v",
      "h264_videotoolbox",
      // "-b:v",
      // "5M",
      // "-c:a",
      // "aac",
      // "-b:a",
      // "128k",
      "/Users/hacker/Downloads/video.mov",
    ]);
    // const command = Command.create("node");
    command.on("close", (data) => {
      console.log(
        `command finished with code ${data.code} and signal ${data.signal}`
      );
      console.log("time:", Date.now() - start);
    });
    command.on("error", (error) => console.error(`command error: "${error}"`));
    command.stdout.on("data", (line) =>
      console.log(`command stdout: "${line}"`)
    );
    command.stderr.on("data", (line) =>
      console.log(`command stderr: "${line}"`)
    );

    // const child = await command.spawn();

    const child = await command.spawn();
    console.log("pid:", child.pid);
  });
</script>

<main class="container">
  <h1>Welcome to Tauri!</h1>

  <div class="row">
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo vite" alt="Vite Logo" />
    </a>
    <a href="https://tauri.app" target="_blank">
      <img src="/tauri.svg" class="logo tauri" alt="Tauri Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank">
      <img src="/svelte.svg" class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>

  <p>Click on the Tauri, Vite, and Svelte logos to learn more.</p>

  <div class="row"></div>

  <div></div>
</main>

<style>
  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>
