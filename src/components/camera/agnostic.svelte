<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Html5Qrcode } from "html5-qrcode";
  import { spotDeconstructor, type Item } from "@/lib/spot-deconstructor";
  import { history } from "@/lib/history";
  export let save = false;

  const dispatch = createEventDispatcher<{ scanned: Item }>();
  let scanning = false;

  function onScanFailure(error: string) {
    console.warn(`Code scan error = ${error}`);
  }

  function onScanSuccess(qrCode: string) {
    const qrcode = spotDeconstructor(qrCode);
    if (!save) return;
    history.add(qrcode);
    dispatch("scanned", qrcode);
  }

  let html5Qrcode: Html5Qrcode;

  onMount(() => {
    html5Qrcode = new Html5Qrcode("reader");
    scanning = true;
    start();
    return () => {
      html5Qrcode.stop();
    };
  });

  function start() {
    console.log("Starting camera");
    html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanFailure,
    );
    scanning = true;
  }

  // @ts-ignore
</script>

<div class=" w-full rounded-xl z-40" id="reader" on:load={start} />
