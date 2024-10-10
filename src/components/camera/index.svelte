<script lang="ts">
  import { settings, type Setting } from "@/lib/settings";
  import Agnostic from "./agnostic.svelte";
  import BarcodeDetector from "./barcode-detector.svelte";
  import type { Writable } from "svelte/store";

  const barcodeDetector = settings.get("barcodeDetector") as Writable<Setting>;
</script>

{#key $barcodeDetector}
  {#if $barcodeDetector.value}
    <BarcodeDetector on:scanned />
  {:else}
    <Agnostic on:scanned />
  {/if}
{/key}
