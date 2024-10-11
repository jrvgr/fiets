<script lang="ts">
  import { onMount } from "svelte";
  import { history } from "@/lib/history";
  import { settings } from "@/lib/settings";
  import { spotDeconstructor, type Item } from "@/lib/spot-deconstructor";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ scanned: Item }>();
  const cameraStream = getCameraStream();
  let videoElement: HTMLVideoElement;
  export let save = true;

  async function getCameraStream() {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
      },
      audio: false,
    });
  }

  onMount(() => {
    cameraStream.then((stream) => {
      videoElement.srcObject = stream;
    });
  });

  // @ts-ignore -- the barcodeDetector api is not yet in the typescript lib, so we need to ignore this
  if (!("BarcodeDetector" in globalThis)) {
    settings.update("barcodeDetector", false);
    settings.flush();
  }

  // @ts-ignore -- the barcodeDetector api is not yet in the typescript lib, so we need to ignore this
  const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code", "unknown"],
  });

  setInterval(async () => {
    try {
      const barcodes = await barcodeDetector.detect(videoElement);
      if (barcodes.length <= 0 || !save) return;
      const qrcode = spotDeconstructor(barcodes[0].rawValue);
      history.add(qrcode);
      dispatch("scanned", qrcode);
    } catch {}
  }, 1000);
</script>

{#await cameraStream}
  <p>Loading...</p>
{:then}
  <video
    class="rounded-xl"
    bind:this={videoElement}
    autoplay={true}
    playsinline={true}
  >
    <track kind="captions" />
  </video>
{/await}
