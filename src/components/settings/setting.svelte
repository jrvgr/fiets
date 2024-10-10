<script lang="ts">
  import { settings, type CustomValue, type Setting } from "@/lib/settings";
  export let name: string;
  export let id: string;
  export let value: any;
  export let description: string;
  export let type: string;
  export let customValues: CustomValue[] | undefined = undefined;
  export let isCustomValue = false;
  export let placeholder: string = "";

  console.log(customValues);

  const update = () => {
    settings.update(id, value, isCustomValue ? name : undefined);
  };
</script>

{#if type === "boolean"}
  <label class="flex gap-3 m-3">
    <input type="checkbox" bind:checked={value} on:change={update} />
    <span aria-hidden class="w-px bg-gray-200"> </span>
    {description}
  </label>
{:else if type === "number"}
  <label>
    <input type="number" bind:value on:change={update} />
    {description}
  </label>
{:else if type === "string"}
  <label class="flex flex-col m-3">
    {description}:
    <input
      type="text"
      class="settings-input"
      bind:value
      {placeholder}
      on:change={update}
    />
  </label>
{/if}

{#if customValues && customValues.length > 0}
  <details class="ml-4 mb-2">
    <summary> More settings for {name} </summary>
    {#each customValues as customValue}
      <div class="-ml-4">
        <svelte:self
          {id}
          description={customValue.description}
          name={customValue.name}
          value={customValue.value}
          type={customValue.type}
          isCustomValue={true}
        />
      </div>
    {/each}
  </details>
{/if}
