<script lang="ts">
  export let date: Date;
  export let row: string;
  export let location: string;
  export let spot: string;
</script>

<div class="flex flex-col gap-2">
  <div class="flex flex-col gap-1">
    <span class="font-bold">Date:</span>
    <span>{date.toString()}</span>
  </div>
  <div class="flex flex-col gap-1">
    <span class="font-bold">Location:</span>
    <span>{location}</span>
  </div>
  <div class="flex flex-col gap-1">
    <span class="font-bold">Spot:</span>
    <span>{spot}</span>
  </div>
  <div class="flex flex-col gap-1">
    <span class="font-bold">Rows:</span>
    <span>{row}</span>
  </div>
</div>
