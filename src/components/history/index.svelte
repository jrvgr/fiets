<script lang="ts">
  import HistoryElement from "./history.svelte";
  import XIcon from "@/components/icons/x.svelte";
  import { history } from "@/lib/history";

  export let showModal = false;
  const historyItems = history.get();

  let dialogElement: HTMLDialogElement;
  $: if (dialogElement && showModal) dialogElement.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialogElement}
  on:close={() => (showModal = false)}
  on:click|self={() => dialogElement.close()}
  class="p-3 open:flex w-full mx-5 flex-col gap-2 rounded-xl"
>
  <h1 class="text-2xl my-1 font-bold">History</h1>
  <button
    aria-label="Close history dialog"
    class="w-10 h-10 absolute p-2 rounded-full top-3 right-2"
    on:click={() => dialogElement.close()}
  >
    <XIcon />
  </button>

  {#each historyItems as historyItem}
    <div class="bg-gray-100 p-2 rounded-xl">
      <HistoryElement
        row={historyItem.row}
        spot={historyItem.spot}
        date={historyItem.date}
        location={historyItem.location}
      />
    </div>
  {/each}
</dialog>
