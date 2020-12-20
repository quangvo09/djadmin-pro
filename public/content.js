var currentTab = "match";

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

function appendModal() {
  const modal = document.createElement("dialog");
  modal.innerHTML = `
    <div class="close-container">
      <button class="close">x</button>
    </div>
    <div id="modal-content">
      <div class="filter-column"></div>
      <div class="tab">
        <button class="tab-links active" id="tab-link-match">Match</button>
        <button class="tab-links" id="tab-link-null">Null</button>
      </div>
    </div>
    <!-- Tab content -->
    <div id="match" class="tab-content" style="display: block;">
      <textarea class="filter-box" name="filter-box" rows="10"></textarea>
    </div>
    <div id="null" class="tab-content">
      <fieldset>
        <label for="is-null">True</label>
        <input type="radio" name="filter-null" id="is-null" value="True">
        <label for="is-not-null">False</label>
        <input type="radio" name="filter-null" id="is-not-null" value="False">
      </fieldset>
    </div>
    <div id="modal-footer">
      <div class="flex-row">
        <button class="btn btn-primary btn-append-filter">Filter</button>
        <button class="btn btn-secondary btn-filter">Filter Only Column</button>
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
  dialog.querySelector("#tab-link-match").addEventListener("click", (event) => {
    openTab(event, "match");
  });
  dialog.querySelector("#tab-link-null").addEventListener("click", (event) => {
    openTab(event, "null");
  });

  dialog
    .querySelector("button.btn-append-filter")
    .addEventListener("click", () => {
      const columnName = dialog.querySelector(".filter-column").innerHTML;

      if ("URLSearchParams" in window) {
        const searchParams = new URLSearchParams(window.location.search);
        const isApplied = applyFilter(searchParams, columnName);
        if (isApplied) {
          window.location.search = searchParams.toString();
        }
      }
    });

  dialog.querySelector("button.btn-filter").addEventListener("click", () => {
    const columnName = dialog.querySelector(".filter-column").innerHTML;

    if ("URLSearchParams" in window) {
      const searchParams = new URLSearchParams();
      const isApplied = applyFilter(searchParams, columnName);
      if (isApplied) {
        window.location.search = searchParams.toString();
      }
    }
  });
}

function showModal(columnName) {
  const dialog = document.querySelector("dialog");
  dialog.querySelector(".filter-column").innerHTML = columnName;
  dialog.showModal();

  setTimeout(() => {
    dialog.querySelector(".filter-box").focus();
  }, 300);
}

function appendFilterButtons() {
  var columns = document.querySelectorAll("#result_list th.sortable");

  columns.forEach(function (col) {
    const classNames = col.className.split(" ");
    const tableColumn = classNames.find((c) => c.startsWith("column-"));
    const columnName = tableColumn.split("-")[1];

    var button = document.createElement("button");
    button.className = "filter";
    button.innerHTML = columnName;
    col.prepend(button);

    button.addEventListener("click", function (event) {
      event.preventDefault();
      showModal(columnName);
    });
  });
}

/// BOOTSTRAP \\\
appendModal();
appendFilterButtons();
