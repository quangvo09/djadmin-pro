<svelte:options accessors={true} />

<script>
  export let columns = [];
  export let applyFilter;
  let selectedColumns = [];
  let checkedAll = false;
  let keyword = "";

  function checkAll() {
    if (checkedAll) {
      selectedColumns = [];
      checkedAll = false;
    } else {
      selectedColumns = columns;
      checkedAll = true;
    }
  }
</script>

<div>
  <div>
    <label style="font-weight: bold;">
      <input type="checkbox" placeholder="Search field" on:click={checkAll} /> Check
      all</label
    >

    <input
      type="text"
      bind:value={keyword}
      placeholder="Search field"
      style="margin-left: 30px;"
    />
  </div>

  <div
    style="margin-top: 20px; display: grid; column-gap: 10px; row-gap: 5px; grid-template-columns: auto auto auto auto ;"
  >
    {#each columns as column}
      {#if keyword == "" || column
          .toLowerCase()
          .includes(keyword.toLowerCase())}
        <label style="display: block;"
          ><input
            type="checkbox"
            name="columns"
            value={column}
            bind:group={selectedColumns}
          />
          {column}
        </label>
      {:else}
        <label style="display: none;"
          ><input
            type="checkbox"
            name="columns"
            value={column}
            bind:group={selectedColumns}
          />
          {column}
        </label>
      {/if}
    {/each}
  </div>

  <div style="margin-top: 20px;">
    <button on:click={() => applyFilter(selectedColumns)} class="btn-secondary"
      >Apply</button
    >
  </div>
</div>
