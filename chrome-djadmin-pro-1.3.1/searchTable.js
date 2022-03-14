var tableSelect = null;

function parseTable(el) {
  var schema = el.querySelector(".section").innerText;
  var tables = [];
  var els = el.querySelectorAll("tr th a");
  for (let i = 0; i < els.length; i++) {
    let name = els[i].innerText;
    let path = els[i].getAttribute("href");

    tables.push({
      schema: schema,
      name: name,
      path: path,
    });
  }
  return tables;
}

function extractTable() {
  var tables = [];
  var els = document.querySelectorAll(
    "#nav-sidebar table,.dashboard #content-main table"
  );
  for (var i = 0; i < els.length; i++) {
    tables = tables.concat(parseTable(els[i]));
  }

  return tables;
}

function appendSearchTableDialog() {
  const modal = document.createElement("dialog");
  const tables = extractTable();

  modal.className = "search";
  modal.innerHTML = `
    <div class="close-container">
      <button class="close">x</button>
    </div>
    <div id="modal-content" style="height: 340px">
      <div class="filter-select">
      <select name="table-columns" id="table-list" class="wide">
      ${tables
        .map(
          (c) => `<option value="${c.path}">${c.name} - ${c.schema}</option>`
        )
        .join("")}
      </select>
    </div>
  `;
  document.body.appendChild(modal);

  const dialog = document.querySelector("dialog.search");
  dialog.querySelector("button.close").addEventListener("click", () => {
    dialog.close();
  });

  tableSelect = new NiceSelect(document.getElementById("table-list"), {
    searchable: true,
    onChanged: function (selected, e) {
      if (e.ctrlKey || e.metaKey) {
        let link = document.createElement("a");
        link.href = window.location.href;
        link.pathname = selected[0];
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        dialog.close();
      } else {
        let link = document.createElement("a");
        link.href = window.location.href;
        link.pathname = selected[0];
        link.search = "";
        window.location.href = link.href;
        dialog.close();
      }
    },
  });
}

function bindSearchTable() {
  document.addEventListener("keydown", function (event) {
    if (
      (event.ctrlKey && event.key === "J") ||
      (event.metaKey && event.shiftKey && event.key === "p")
    ) {
      const dialog = document.querySelector("dialog.search");
      dialog.showModal();
      setTimeout(() => {
        tableSelect.focus();
      }, 300);
    }
  });
}

appendSearchTableDialog();
bindSearchTable();
