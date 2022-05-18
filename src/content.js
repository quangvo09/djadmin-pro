var currentTab = "match";
var selectInstance = null;

function applyFilter(searchParams, columnName) {
  const dialog = document.querySelector("dialog");

  switch (currentTab) {
    case "null": {
      const radioButtons = document.getElementsByName("filter-null");
      const value = Array.from(radioButtons).find((r) => r.checked)?.value;

      if (value) {
        searchParams.set(`${columnName}__isnull`, value);
        return true;
      }

      return false;
    }
    case "empty": {
      const radioButtons = document.getElementsByName("filter-empty");
      const value = Array.from(radioButtons).find((r) => r.checked)?.value;

      if (value === "True") {
        searchParams.set(`${columnName}__regex`, `^\s*$`);
        return true;
      } else if (value === "False") {
        searchParams.set(`${columnName}__regex`, `\\S`);
        return true;
      }

      return false;
    }
    case "match": {
      const value = dialog.querySelector(".filter-box").value?.trim();

      const values = value
        .split("\n")
        .map((code) => code.trim())
        .filter((code) => code.length > 0);

      if (values.length > 1) {
        searchParams.set(`${columnName}__in`, values.join(","));
        return true;
      }

      if (value.length > 0) {
        searchParams.set(columnName, value);
        return true;
      }

      return false;
    }
    case "string": {
      const radioButtons = document.getElementsByName("filter-string");
      const operator = Array.from(radioButtons).find((r) => r.checked)?.value;
      const value = dialog.querySelector(".string-query-box").value?.trim();

      if (value?.length > 1 && operator?.length > 0) {
        searchParams.set(`${columnName}__${operator}`, value);
        return true;
      }

      return false;
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
        searchParams.set(`${columnName}__${operator}`, dateString);
        return true;
      }

      return false;
    }
    default:
      return false;
  }
}

function openTab(evt, key) {
  currentTab = key;

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
  document.getElementById(key).style.display = "block";
  evt.currentTarget.className += " active";
}

function setFilter() {
  const element = document.getElementById("table-columns");
  const columnName = element.value;

  if ("URLSearchParams" in window) {
    const searchParams = new URLSearchParams();
    const isApplied = applyFilter(searchParams, columnName);
    if (isApplied) {
      window.location.search = searchParams.toString();
    }
  }
}

function appendFilter() {
  const element = document.getElementById("table-columns");
  const columnName = element.value;

  if ("URLSearchParams" in window) {
    const prevSearchParams = new URLSearchParams(window.location.search);
    const searchParams = new URLSearchParams();
    prevSearchParams.forEach((value, key) => {
      if (!key.startsWith(`${columnName}__`)) {
        searchParams.set(key, value);
      }
    });

    const isApplied = applyFilter(searchParams, columnName);
    if (isApplied) {
      window.location.search = searchParams.toString();
    }
  }
}

function appendModal() {
  const modal = document.createElement("dialog");
  modal.className = "filter";
  var columns = document.querySelectorAll("#result_list th.sortable");

  const columnNames = [];
  columns.forEach(function (col) {
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
            .join("")}
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
    els[i].addEventListener("click", (event) => {
      const target = els[i].getAttribute("target");
      openTab(event, target);
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
    onChanged: function () {
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

  columns.forEach(function (col) {
    const classNames = col.className.split(" ");
    const tableColumn = classNames.find((c) => c.startsWith("column-"));
    const columnName = tableColumn.split("-")[1];

    // Append copy button
    var copyButton = document.createElement("button");
    copyButton.className = "btn-secondary";
    copyButton.innerHTML = "Copy";
    col.prepend(copyButton);

    copyButton.addEventListener("click", function (event) {
      event.preventDefault();

      var valueCols = document.querySelectorAll(
        `#result_list tbody .field-${columnName}`
      );
      var values = [];
      valueCols.forEach(function (el) {
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

    button.addEventListener("click", function (event) {
      event.preventDefault();
      showModal(columnName);
      setTimeout(() => {
        dialog.querySelector(".filter-box").focus();
      }, 300);
    });
  });
}

function bindSearchField() {
  document.addEventListener("keydown", function (event) {
    if (
      (event.ctrlKey && event.key === "j") ||
      (event.shiftKey && event.altKey && event.key === "p")
    ) {
      showModal(null, false);
      setTimeout(() => {
        selectInstance.focus();
      }, 300);
    }
  });
}

function bindFilterApply() {
  const dialog = document.querySelector("dialog.filter");

  dialog.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.keyCode == 13) {
      setFilter();
      event.preventDefault();
    }

    if (event.shiftKey && event.keyCode == 13) {
      appendFilter();
      event.preventDefault();
    }
  });
}

function cleanDecimalValue() {
  const pattern = /^(\d+.0{2})(0{10,})(.*)$/;
  document
    .querySelectorAll('#result_list td[class^="field-"]')
    .forEach(function (el) {
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

/// BOOTSTRAP \\\
appendModal();
appendFilterButtons();
bindingHotkey();
cleanDecimalValue();
