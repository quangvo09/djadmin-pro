<svelte:options accessors={true} />

<script>
  let columns = [];
  let keyword = "";
  let inputElement;

  export function setColumns(data) {
    columns = data;
    console.log(columns);
    inputElement.focus();
  }
</script>

<div>
  <input
    type="text"
    bind:value={keyword}
    bind:this={inputElement}
    placeholder="Search field"
  />
  <table width="100%">
    <tbody>
      {#each columns as column}
        {#if column.name.includes(keyword)}
          <tr>
            <th>{column.name}</th>
            <td>{column.value}</td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
