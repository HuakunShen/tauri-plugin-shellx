<script lang="ts">
  import {
    executeBashScript,
    executePowershellScript,
    executePythonScript,
    hasCommand,
    likelyOnWindows
  } from 'tauri-plugin-shellx-api'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { type Block } from '$lib/types'
  import { onMount } from 'svelte'

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
    const output = await defaultShellExecuter(command)
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
    isOnWindows = await likelyOnWindows()
    scrollToBottom()
  })
</script>

<div class="py-3 px-4 flex flex-col h-screen">
  <div
    class="grow overflow-y-auto flex flex-col space-y-2"
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
            <div>stdout: {block.stdout}</div>
          {/if}
          <div class="text-red-500">stderr: {block.stderr}</div>
        </div>
      {:else}
        <div class="flex space-x-2 pl-5">
          <span>{block.stdout}</span>
        </div>
      {/if}
    {/each}
  </div>
  <form class="flex w-full items-center space-x-2" on:submit={onSubmit}>
    <Input
      type="text"
      placeholder="Enter Command"
      bind:value={command}
      autofocus
    />
    <Button type="submit">Run</Button>
  </form>
</div>
