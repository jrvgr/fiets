<script lang="ts">
  import { settings, type Setting } from "@/lib/settings";
  import Agnostic from "./agnostic.svelte";
  import BarcodeDetector from "./barcode-detector.svelte";
  import type { Writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";
  import type { Item } from "@/lib/spot-deconstructor";
  import RescanIcon from "@/components/icons/rescan.svelte";

  let saving = true;

  const dispatch = createEventDispatcher<{ scanned: Item }>();

  function onScan(event: CustomEvent<Item>) {
    saving = false;
    dispatch("scanned", event.detail);
  }

  // check if the camera is present on the device
  const cameraIsPresent = navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(() => true)
    .catch(() => false);
  const barcodeDetector = settings.get("barcodeDetector") as Writable<Setting>;
</script>

{#await cameraIsPresent}
  <p>Loading...</p>
{:then cameraIsPresent}
  {#if cameraIsPresent}
    {#key $barcodeDetector}
      <div class="w-full h-full relative">
        {#if $barcodeDetector.value}
          <BarcodeDetector on:scanned={onScan} save={saving} />
        {:else}
          <Agnostic on:scanned={onScan} save={saving} />
        {/if}

        {#if !saving}
          <button
            class="rounded-xl animate-zoom w-full h-full absolute flex flex-col justify-center items-center top-0 z-50 bg-gray-300 opacity-85"
            on:click={() => (saving = true)}
          >
            <span class="w-10 h-10 mt-5 bg-bl">
              <RescanIcon />
            </span>
            Rescan
          </button>
        {/if}
      </div>
    {/key}
  {:else}
    <p class="h-full flex items-center">
      Camera not found. You need at least a camera to use Fiets
    </p>
  {/if}
{/await}
