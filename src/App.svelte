<script lang="ts">
  import { writable } from "svelte/store";
  import Camera from "./components/camera.svelte";
  import { latestCode } from "./store";
  import Bike from "./components/bike.svelte";
  import Parking from "./components/parking.svelte";

	let showChanged = false
	let oldCode = localStorage.getItem("latestCode") ?? ""

	latestCode.subscribe((value) => {
		if (value === oldCode) return;
		showChanged = true
		setTimeout(() => {
			showChanged = false
		}, 5500)
	})

  $: codeUrl = new URL($latestCode);
  $: path = codeUrl.pathname.split("/").pop();
  // row is the last letter and the first digit of path
  $: row = path?.match(/[a-zA-Z]\d/)?.[0];
  // spot is everything after the first digit
  $: spot = path?.match(/\d.*/)?.[0].slice(1);
</script>

<main class="p-6 flex flex-col items-center gap-4 bg-zinc-50 h-[100dvh] w-[100dvw]">
  <div class="flex scale-[3] mb-5 mt-2"><Bike /> <Parking /></div>
  <Camera />
  <div class="flex gap-4 flex-grow items-center">
    <p class="text-xl">row: {row}</p>
    <p class="text-xl">spot: {spot}</p>
  </div>
	{#if showChanged}
		<p class="text-xl animate-ping">Spot has changed</p>
	{/if}
</main>

<style>
</style>
