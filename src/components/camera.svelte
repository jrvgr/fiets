<script lang="ts">
  import { onMount } from "svelte";
  import { latestCode } from "../store";

  const cameraStream = getCameraStream();
  let videoElement: HTMLVideoElement;

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
  if (!("BarcodeDetector" in globalThis)) {
    alert("BarcodeDetector is not supported in this browser");
  }

  // @ts-ignore
  const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code", "unknown"],
  });
  setInterval(async () => {
    console.log("detecting barcodes");
    const barcodes = await barcodeDetector.detect(videoElement);
    console.log(barcodes);
    if (barcodes.length <= 0) return;
    $latestCode = (barcodes[0].rawValue);
    localStorage.setItem("latestCode", barcodes[0].rawValue);
  }, 1000);
</script>

{#await cameraStream}
  <p>Loading...</p>
{:then}
  <video class="rounded-xl border-black border-x-8 border-y-8" bind:this={videoElement} autoplay={true} playsinline={true}>
    <track kind="captions" />
  </video>
{/await}
