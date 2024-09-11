<script lang="ts">
  import {
    executeBashScript,
    executePowershellScript,
    executePythonScript,
    hasCommand,
    likelyOnWindows,
    Command
  } from 'tauri-plugin-shellx-api'
  import { RotateCcwIcon } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { type Block } from '$lib/types'
  import { onMount } from 'svelte'

  let running = false
  let isOnWindows: boolean
  $: defaultShellExecuter = isOnWindows
    ? executePowershellScript
    : executeBashScript
  let command = ''
  let blocksElement: HTMLDivElement
  let blocks: Block[] = []

  function scrollToBottom() {
    blocksElement.scrollTop = blocksElement.scrollHeight
  }

  async function onSubmit(event: Event) {
    event.preventDefault()
    if (command === 'clear') {
      blocks = []
      command = ''
      return
    }
    running = true
    const output = await defaultShellExecuter(command)
    running = false
    blocks.push({ type: 'input', stdout: command, stderr: '' })
    if (output.code && output.code !== 0) {
      blocks.push({
        type: 'error',
        stdout: output.stdout,
        stderr: output.stderr,
        status: output.code
      })
    } else {
      blocks.push({
        type: 'output',
        stdout: output.stdout,
        stderr: output.stderr
      })
    }
    blocks = blocks

    setTimeout(() => {
      scrollToBottom()
    }, 100)
    command = ''
  }

  onMount(async () => {
    // isOnWindows = await likelyOnWindows()
    console.log(
      "PWD from worker-ext",
      await Command.create("pwd", [], { cwd: "/Users/hacker/Desktop" }).execute()
    )

    scrollToBottom()
  })
</script>

<div class="absolute w-full h-full flex justify-center items-center -z-10">
  {#if running}
    <RotateCcwIcon class="animate-spin w-28 h-28 opacity-30" />
  {/if}
</div>
<div class="py-3 px-4 flex flex-col h-screen">
  <div
    class="grow overflow-y-auto flex flex-col space-y-2 font-mono"
    bind:this={blocksElement}
  >
    {#each blocks as block}
      {#if block.type === 'input'}
        <div class="flex space-x-2 font-bold">
          <span class="text-gray-400">></span>
          <span>{block.stdout}</span>
        </div>
      {:else if block.type === 'error'}
        <div class="pl-5">
          <div class="text-red-500">Status Code: {block.status}</div>
          {#if block.stdout}
            <div><span class="opacity-50">stdout:</span> {block.stdout}</div>
          {/if}
          {#if block.stdout}
            <div class="text-red-500">stderr: {block.stderr}</div>
          {/if}
        </div>
      {:else}
        <div class="flex space-x-2 pl-5">
          {#if block.stdout}
            <div><span class="opacity-50">stdout:</span> {block.stdout}</div>
          {/if}
          {#if block.stderr}
            <div class="text-red-500">stderr: {block.stderr}</div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
  <form class="flex w-full items-center space-x-2" on:submit={onSubmit}>
    <Input
      type="text"
      disabled={running}
      placeholder="Enter Command"
      bind:value={command}
      autofocus
    />
    <Button type="submit" disabled={running}>Run</Button>
  </form>
</div>
