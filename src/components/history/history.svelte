<script lang="ts">
  import dayjs from "dayjs";
  import calendar from "dayjs/plugin/calendar";
  dayjs.extend(calendar);

  export let date: Date;
  export let row: string;
  export let location: string;
  export let spot: string;
</script>

<div class="grid gap-4 grid-rows-2 grid-cols-3">
  <div class="flex flex-col gap-1 col-span-3">
    <span class="font-bold">Date:</span>
    <span>{dayjs(date).calendar()}</span>
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
