// deno-lint-ignore-file no-var
import "./content.css";
var currentTab = "match";
var selectInstance = null;
var filters = [];
var columnNames = [];
var selectedColumns = [];
var localSettings = {};

if (typeof chrome !== 'undefined') {
  browser = chrome;
}

function collectFilter(columnName) {
  const dialog = document.querySelector("#filter-modal");
  switch (currentTab) {

    case "null": {
      const radioButtons = document.getElementsByName("filter-null");
      const value = Array.from(radioButtons).find((r) => r.checked)?.value;

      if (value) {
        filters.push([columnName, "isnull", value]);
      }
      break;
    }
    case "empty": {
      const radioButtons = document.getElementsByName("filter-empty");
      const value = Array.from(radioButtons).find((r) => r.checked)?.value;

      if (value === "True") {
        filters.push([columnName, "regex", `^\s*$`]);
      } else if (value === "False") {
        filters.push([columnName, "regex", `\\S`]);
      }

      break;
    }
    case "match": {
      const value = dialog.querySelector(".filter-box").value?.trim();

      const values = value
        .split("\n")
        .map((code) => code.trim())
        .filter((code) => code.length > 0);

      if (values.length > 1) {
        filters.push([columnName, "in", values.join(",")]);
        break;
      }

      if (value.length > 0) {
        filters.push([columnName, null, values]);
      }
      break;
    }
    case "string": {
      const radioButtons = document.getElementsByName("filter-string");
      const operator = Array.from(radioButtons).find((r) => r.checked)?.value;
      const value = dialog.querySelector(".string-query-box").value?.trim();

      if (value?.length > 1 && operator?.length > 0) {
        filters.push([columnName, operator, value]);
      }
      break;
    }
    case "datetime": {
      const radioButtons = document.getElementsByName("filter-datetime");
      const operator = Array.from(radioButtons).find((r) => r.checked)?.value;
      const value = dialog.querySelector("#datetime_value").value?.trim();

      if (value?.length > 1 && operator?.length > 0) {
        const localDate = new Date(value);
        const year = `${localDate.getUTCFullYear()}`;
        const month = `${localDate.getUTCMonth() + 1}`.padStart(2, "0");
        const day = `${localDate.getUTCDate()}`.padStart(2, "0");
        const hour = `${localDate.getUTCHours()}`.padStart(2, "0");
        const minute = `${localDate.getUTCMinutes()}`.padStart(2, "0");
        const dateString = `${year}-${month}-${day} ${hour}:${minute}`;
        filters.push([columnName, operator, dateString]);
      }

      break;
    }
    default:
      return false;
  }
}

function compileFilter(searchParams) {
  filters.forEach((filter) => {
    const [columnName, operator, value] = filter;
    if (operator) {
      searchParams.set(`${columnName}__${operator}`, value);
    } else {
      searchParams.set(columnName, value);
    }
  });
}

function openTab(tabId) {
  // Get all elements with class="tab-content" and hide them
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  // Get all elements with class="tab-links" and remove the class "active"
  const tabLinks = document.getElementsByClassName("tab-links");
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabId).style.display = "block";
  currentTab = tabId;
  document.querySelector(`.tab-links[target=${tabId}]`).className += " active";
}

function setFilter() {
  const element = document.getElementById("table-columns");
  const columnName = element.value;

  if ("URLSearchParams" in window) {
    collectFilter(columnName);
    if (filters.length > 0) {
      const searchParams = new URLSearchParams();
      compileFilter(searchParams);
      window.location.search = searchParams.toString();
    }
  }
}

function appendFilter() {
  const dialog = document.querySelector("#filter-modal");
  const element = document.getElementById("table-columns");
  const columnName = element.value;

  if ("URLSearchParams" in window) {
    collectFilter(columnName);
  }

  openTab("match");
  dialog.querySelector(".filter-box").value = "";
  selectInstance.clear();
  selectInstance.focus();
}

function appendModal() {
  const modal = document.createElement("dialog");
  modal.id = "filter-modal";
  modal.className = "filter";
  var columns = document.querySelectorAll("#result_list th.sortable");

  const columnNames = [];
  columns.forEach(function(col) {
    const classNames = col.className.split(" ");
    const tableColumn = classNames.find((c) => c.startsWith("column-"));
    const columnName = tableColumn.split("-")[1];
    columnNames.push(columnName);
  });

  columnNames.sort();

  modal.innerHTML = `
    <div class="close-container">
      <button class="close">x</button>
    </div>
    <div id="modal-content">
      <div class="filter-column"></div>
      <div class="filter-select">
        <select name="table-columns" id="table-columns" class="wide">
          ${columnNames
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("")
    }
        </select>
      </div>
      <div class="tab">
        <button class="tab-links active" target="match" id="tab-link-match">Match</button>
        <button class="tab-links" target="null" id="tab-link-null">Is Null</button>
        <button class="tab-links" target="empty" id="tab-link-empty">Is Empty</button>
        <button class="tab-links" target="string" id="tab-link-string">String</button>
        <button class="tab-links" target="datetime" id="tab-link-datetime">DateTime</button>
      </div>
    </div>
    <!-- Tab content -->
    <div id="match" class="tab-content" style="display: block;">
      <textarea class="filter-box" id="filter-box" name="filter-box" rows="10" tabindex="1"></textarea>
    </div>
    <div id="null" class="tab-content">
      <fieldset>
        <label for="is-null">True</label>
        <input type="radio" name="filter-null" id="is-null" value="True" checked>
        <label for="is-not-null">False</label>
        <input type="radio" name="filter-null" id="is-not-null" value="False">
      </fieldset>
    </div>
    <div id="empty" class="tab-content">
      <fieldset>
        <label for="is-empty">True</label>
        <input type="radio" name="filter-empty" id="is-empty" value="True" checked>
        <label for="is-not-empty">False</label>
        <input type="radio" name="filter-empty" id="is-not-empty" value="False">
      </fieldset>
    </div>
    <div id="string" class="tab-content">
      <fieldset>
        <label for="contains">Contains</label>
        <input type="radio" name="filter-string" id="contains" value="icontains" checked>
        <label for="starts-with">Starts With</label>
        <input type="radio" name="filter-string" id="starts-with" value="startswith">
        <label for="starts-with">Ends With</label>
        <input type="radio" name="filter-string" id="starts-with" value="endswith">
      </fieldset>
      <div>
        <input type="text" class="string-query-box form-control" name="string-query-box" />
      </div>
    </div>
    <div id="datetime" class="tab-content">
      <fieldset>
        <label for="greater_than_or_equal_to">gte (>=)</label>
        <input type="radio" name="filter-datetime" id="greater_than_or_equal_to" value="gte" checked>
        <label for="less_than_or_equal_to">lte (<=)</label>
        <input type="radio" name="filter-datetime" id="less_than_or_equal_to" value="lte">
      </fieldset>
      <div>
        <input type="datetime-local" id="datetime_value" name="datetime">
        <p><strong>DateTime</strong> is not supported in Firefox, Safari or Internet Explorer 12 (or earlier). ^^</p>
      </div>
    </div>
    <div id="modal-footer">
      <div class="flex-row">
        <button class="btn btn-primary btn-append-filter">Append filter(Shift + &#9166)</button>
        <button class="btn btn-secondary btn-filter">Apply condition(Ctrl + &#9166)</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Binding close button
  const dialog = document.querySelector("dialog");
  dialog.querySelector("button.close").addEventListener("click", () => {
    dialog.close();
  });

  // Binding tab links
  const els = dialog.querySelectorAll(".tab-links");

  for (let i = 0; i < els.length; i++) {
    els[i].addEventListener("click", (_event) => {
      const target = els[i].getAttribute("target");
      openTab(target);
    });
  }

  dialog
    .querySelector("button.btn-append-filter")
    .addEventListener("click", appendFilter);

  dialog
    .querySelector("button.btn-filter")
    .addEventListener("click", setFilter);
}

function showModal(columnName, focusInput) {
  const dialog = document.querySelector("dialog.filter");
  // dialog.querySelector(".filter-column").innerHTML = columnName;
  const element = document.getElementById("table-columns");
  element.value = columnName;
  if (selectInstance) {
    selectInstance.destroy();
  }
  selectInstance = new NiceSelect(document.getElementById("table-columns"), {
    searchable: true,
    onChanged: function() {
      setTimeout(() => {
        dialog.querySelector(".filter-box").focus();
      }, 300);
    },
  });
  dialog.showModal();

  if (focusInput != false) {
    setTimeout(() => {
      dialog.querySelector(".filter-box").focus();
    }, 300);
  }
}

function appendFilterButtons() {
  var columns = document.querySelectorAll("#result_list th.sortable");

  columns.forEach(function(col) {
    const classNames = col.className.split(" ");
    const tableColumn = classNames.find((c) => c.startsWith("column-"));
    const columnName = tableColumn.split("-")[1];
    columnNames.push(columnName);

    // Append copy button
    var copyButton = document.createElement("button");
    copyButton.className = "btn-secondary";
    copyButton.innerHTML = "Copy";
    col.prepend(copyButton);

    copyButton.addEventListener("click", function(event) {
      event.preventDefault();

      var valueCols = document.querySelectorAll(
        `#result_list tbody .field-${columnName}`,
      );
      var values = [];
      valueCols.forEach(function(el) {
        let content = el.textContent;
        if (el.children[0]?.tagName?.toLocaleLowerCase() === "a") {
          content = content.replace(/\w+\s?\((\d+)\)/, "$1");
        }

        values.push(content);
      });

      navigator.clipboard.writeText(values.join("\n"));

      copyButton.innerHTML = "Copied";
      setTimeout(() => {
        copyButton.innerHTML = "Copy";
      }, 500);
    });

    var button = document.createElement("button");
    button.className = "filter";
    button.innerHTML = columnName;
    col.prepend(button);

    button.addEventListener("click", function(event) {
      event.preventDefault();
      showModal(columnName);
    });
  });

  const node = document.querySelector("#result_list th:nth-child(1)");
  const filterButton = document.createElement("button");

  filterButton.className = "btn-secondary";
  filterButton.innerHTML = "Filter";
  node.prepend(filterButton);

  filterButton.addEventListener("click", function(event) {
    event.preventDefault();
    showColumnPicker();
  });
}

function bindSearchField() {
  document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "j") {
      filters = [];
      showModal(null, false);
      setTimeout(() => {
        selectInstance.focus();
      }, 300);
    }

    if (event.ctrlKey && event.key === "k") {
      filters = [];
      const searchParams = new URLSearchParams(window.location.search);
      for (const [key, value] of searchParams) {
        const parts = key.split("__");
        let operator = null;
        if (parts.length > 1) {
          operator = parts[parts.length - 1];
        }

        filters.push([parts[0], operator, value]);
      }
      showModal(null, false);
      setTimeout(() => {
        selectInstance.focus();
      }, 300);
    }
  });
}

function bindFilterApply() {
  const dialog = document.querySelector("dialog.filter");

  dialog.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.keyCode == 13) {
      setFilter();
      event.preventDefault();
    }

    if (event.shiftKey && event.keyCode == 13) {
      appendFilter();
      event.preventDefault();
    }

    if (event.ctrlKey && event.key == "g") {
      dialog.close();
    }
  });
}

function cleanDecimalValue() {
  const pattern = /^(\d+.0{2})(0{10,})(.*)$/;
  document
    .querySelectorAll('#result_list td[class^="field-"]')
    .forEach(function(el) {
      const text = el.textContent;
      if (text.match(pattern)) {
        el.textContent = text.replace(pattern, "$1");
      }
    });
}

function bindingHotkey() {
  bindSearchField();
  bindFilterApply();
}

import DetailView from "./DetailView.svelte";
import ColumnPicker from "./ColumnPicker.svelte";

const detailDialog = document.createElement("dialog");
const columnPickerDialog = document.createElement("dialog");
let detailViewInstance = null;
let columnPickerInstance = null;
// Inject html model
function injectViewDialog() {
  detailDialog.id = "view-modal";
  detailDialog.style = "width: 80%; height: 80%;";
  detailDialog.innerHTML = `
<div class="close-container">
      <button class="close">x</button>
    </div>
    <div class="modal-content">
</div>
`;

  document.body.appendChild(detailDialog);
  detailDialog.querySelector("button.close").addEventListener("click", () => {
    detailDialog.close();
  });

  try {
    detailViewInstance = new DetailView({
      target: document.querySelector("#view-modal .modal-content"),
    });
  } catch (e) {
    console.log(e);
  }
}

function injectColumnPickerDialog() {
  columnPickerDialog.id = "column-picker-modal";
  columnPickerDialog.style = "width: 80%; height: 80%;";
  columnPickerDialog.innerHTML = `
<div class="close-container">
      <button class="close">x</button>
    </div>
    <div class="modal-content">
</div>
`;

  document.body.appendChild(columnPickerDialog);
  columnPickerDialog
    .querySelector("button.close")
    .addEventListener("click", () => {
      columnPickerDialog.close();
    });

  try {
    columnPickerInstance = new ColumnPicker({
      target: document.querySelector("#column-picker-modal .modal-content"),
      props: {
        columns: [...columnNames].sort(),
        selectedColumns: selectedColumns,
        applyFilter: function(columns) {
          columnPickerDialog.close();
          localSettings[window.location.pathname] = columns;
          browser.storage.local.set({
            selectedColumns: JSON.stringify(localSettings),
          });

          selectedColumns = columns;
          renderColumns();
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
}

function showRowDetail(event) {
  // show modal
  const values = [];
  const el = event.target.closest("tr");
  console.log(el);
  el.childNodes.forEach(function(node, index) {
    if (index > 0) {
      if (node.childNodes.length > 0) {
        values.push(node.childNodes[0]);
      } else {
        values.push(node);
      }
    }
  });

  const columns = [];

  columnNames.forEach(function(columnName, index) {
    columns.push({ name: columnName, value: values[index] });
  });

  detailDialog.showModal();
  detailViewInstance.setColumns(columns);
  event.preventDefault();
}

function showColumnPicker() {
  columnPickerDialog.showModal();
}

function injectViewButtons() {
  document.querySelectorAll("#result_list tbody tr").forEach(function(el) {
    const idColumn = el.querySelector(".field-id");
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "action-buttons";

    const viewButton = document.createElement("a");
    viewButton.className = "view-link";
    viewButton.innerHTML = "View";
    viewButton.addEventListener("click", showRowDetail);

    const editButton = document.createElement("a");
    editButton.className = "edit-link";
    editButton.innerHTML = "Edit";
    editButton.href = idColumn.querySelector("a").href;
    buttonGroup.appendChild(viewButton);
    buttonGroup.appendChild(editButton);
    idColumn.appendChild(buttonGroup);
  });
}

// render table columns based on selected columns
function renderColumns() {
  columnNames.forEach(function(columnName) {
    if (selectedColumns.includes(columnName)) {
      setColumnVisible(columnName, true);
    } else {
      setColumnVisible(columnName, false);
    }
  });
}

// show/hide column
function setColumnVisible(columnName, visible) {
  let display = visible ? "" : "none";
  document
    .querySelectorAll(`#result_list td.field-${columnName}`)
    .forEach(function(el) {
      el.style.display = display;
    });

  document
    .querySelectorAll(`#result_list th.field-${columnName}`)
    .forEach(function(el) {
      el.style.display = display;
    });

  document
    .querySelectorAll(`#result_list th.column-${columnName}`)
    .forEach(function(el) {
      el.style.display = display;
    });
}

/// BOOTSTRAP \\\
console.log("Bootstraping...");
appendModal();
appendFilterButtons();
bindingHotkey();
injectViewDialog();
injectViewButtons();
cleanDecimalValue();

browser.storage.local.get("selectedColumns").then((data) => {
  if (data.selectedColumns) {
    const key = window.location.pathname;
    localSettings = JSON.parse(data.selectedColumns);
    selectedColumns = localSettings[key] || columnNames;
    renderColumns();
  } else {
    selectedColumns = columnNames;
  }
  injectColumnPickerDialog();
});
