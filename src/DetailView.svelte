<svelte:options accessors={true} />

<script>
  import JSONTree from 'svelte-json-tree';
  let columns = [];
  let keyword = "";
  let inputElement;
  let jsonValue = {};
  let showFieldDetail = false;

  export function setColumns(data) {
    columns = data;
    inputElement.focus();
    jsonValue = {};
    showFieldDetail = false;
  }

  function showCopiedMessage(element) {
    const content = element.innerHTML
    element.innerHTML = "✅ Copied!";
    setTimeout(() => {
      element.innerHTML = content;
    }, 1000);
  }

  function jsonTree(value) {
    try {
      jsonValue = JSON.parse(value);
    } catch (e) {
      jsonValue = null;
      console.log(e);
    }
  }

  function isJsonString(str) {
    try {
      const data = JSON.parse(str);
      return typeof data === 'object';
    } catch (e) {
      return false;
    }  
    return true;
  }

</script>

<div class="detail-view-container">
  <div class="table-view" class:show={!showFieldDetail}>
    <input
      type="text"
      bind:value={keyword}
      bind:this={inputElement}
      placeholder="Search field"
      /> 
    <table width="100%<">
      <tbody>
        {#each columns as column}
          {#if column.name.includes(keyword)}
            {@const isJson = isJsonString(column.value.textContent)}
            <tr>
              <th>{column.name}</th>
              <td class="value-cell">
                {@html column.value.outerHTML || column.value.textContent}
                <div class="actions" class:absolute={isJson}>
                  {#if column.value.textContent  !== "-" && column.value.textContent !== ""}
                    <button
                      class="action-button"
                      on:click={(e) => {
                      navigator.clipboard.writeText(column.value.textContent);
                      showCopiedMessage(e.target);
                      }}
                      >
                      📋
                    </button>
                  {/if}
                  {#if isJson}
                    <button
                      class="action-button"
                      on:click={() => {
                      jsonTree(column.value.textContent);
                      showFieldDetail = true;
                      }}
                      >
                      👀 Json
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
  <div class="json-view" class:show={showFieldDetail}>
    <div class="mb-4">
      <button class="btn-primary" on:click={() => showFieldDetail = false }>Close json view</button>
    </div>
    <JSONTree value={jsonValue} defaultExpandedLevel={3} shouldShowPreview={false} />
  </div>
</div>

<style>
  .value-cell{
    position: relative;
  }

  .absolute{
    position: absolute;
  }
  
  .actions{
    top: 3px;
    right: 3px;
    display: inline-block;
  }
  
  .action-button{
    padding: 2px;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .table-view{
    display: none;
  }

  .json-view{
    display: none;
    padding: 20px;
    background: #f9efe3;
    --json-tree-font-size: 14px;
  }
  
  .show{
    display: block;
  }

  .btn-primary{
    background: #4b6982;
    color: #fff;
    border: 0;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .mb-4{
    margin-bottom: 16px;
  }
</style>
