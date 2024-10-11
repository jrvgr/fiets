<script lang="ts">
  import { type Writable } from "svelte/store";
  import { settings, type Setting } from "@/lib/settings";
  import SettingElement from "./setting.svelte";
  import { get } from "svelte/store";
  import XIcon from "@/components/icons/x.svelte";
  export let showModal = false;

  const currentSettings = settings.get() as Record<string, Writable<Setting>>;
  const settingItems = Object.entries(currentSettings);

  let dialogElement: HTMLDialogElement;
  $: if (dialogElement && showModal) dialogElement.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
{#key showModal}
  <dialog
    bind:this={dialogElement}
    on:close={() => (showModal = false)}
    on:click|self={() => dialogElement.close()}
    on:close
    class="p-3 animate-zoom open:flex flex-col gap-2 rounded-xl"
  >
    <h1 class="text-2xl my-1 font-bold">Settings</h1>
    <button
      aria-label="Close settings dialog"
      class="w-10 h-10 absolute p-2 rounded-full top-3 right-2"
      on:click={() => dialogElement.close()}
    >
      <XIcon />
    </button>

    {#each settingItems as [id, setting]}
      {@const item = get(setting)}
      <div class="bg-gray-100 p-1 rounded-xl">
        <SettingElement
          {id}
          placeholder={item.placeholder}
          name={item.name}
          description={item.description}
          type={item.type}
          value={item.value}
          customValues={item.customValues}
        />
      </div>
    {/each}
  </dialog>
{/key}
