<script lang="ts">
  import Camera from "./components/camera/index.svelte";
  import Bike from "./components/icons/bike.svelte";
  import Parking from "./components/icons/parking.svelte";
  import CogwheelIcon from "./components/icons/cogwheel.svelte";
  import HistoryIcon from "./components/icons/history.svelte";
  import { history } from "@/lib/history";
  import type { Item } from "./lib/spot-deconstructor";

  let showSettingsDialog = false;
  let showHistoryDialog = false;
  import Settings from "@/components/settings/index.svelte";
  import History from "@/components/history/index.svelte";

  const onScanned = (event: CustomEvent<Item>) => {
    latestCode = event.detail;
  };

  let latestCode = history.get()[0] ?? ({} as Item);
</script>

<main
  class="p-6 flex flex-col items-center gap-4 bg-zinc-50 h-[100dvh] w-[100dvw]"
>
  <div class="flex justify-between items-baseline w-full">
    <button
      aria-label="Settings"
      class="bg-zinc-100 w-12 h-12 p-3 rounded-md"
      on:click={() => (showSettingsDialog = !showSettingsDialog)}
      ><CogwheelIcon /></button
    >
    <div class="flex mb-5 mt-2 w-18 h-14">
      <Bike />
      <Parking />
    </div>
    <button
      aria-label="History"
      class="bg-zinc-100 w-12 h-12 p-3 rounded-md"
      on:click={() => (showHistoryDialog = !showHistoryDialog)}
    >
      <HistoryIcon /></button
    >
  </div>
  <Camera on:scanned={onScanned} />
  {#key latestCode}
    <div class="animate-scale text-xl flex h-full items-center">
      {#if latestCode.row && latestCode.spot}
        <p>
          row: {latestCode.row}
          spot: {latestCode.spot}
        </p>
      {:else}
        <p>Scan a QR code in a NS Parking garage to get started</p>
      {/if}
    </div>
  {/key}
</main>

<Settings bind:showModal={showSettingsDialog} />
<History bind:showModal={showHistoryDialog} />
