// anchor is first module in list, if anchor is not found, we are not in home page
const anchor = document.querySelector("#content-main .module:first-child");

if (anchor) {
  const apps = [];
  document.querySelectorAll("#content-main .module").forEach(function (el) {
    apps.push({
      name: el.querySelector("a.section").textContent,
      url: el.querySelector("a.section").getAttribute("href"),
    });
  });

  const appElements = apps
    .map(
      (app) => `
        <tr class="model-logentry">
          <th scope="row"><a href="${app.url}">${app.name}</a></th>
          <td></td>
          <td></td>
        </tr>
        `
    )
    .join("");

  const module = document.createElement("div");
  module.innerHTML = `
  <div class="module" id="app-list">
    <table>
      <caption>
        <a href="/" class="section" title="apps">Apps</a>
      </caption>
      <tbody>
        ${appElements}
      </tbody>
    </table>
  </div>
  `;

  anchor.parentElement.insertBefore(module, anchor);
}
