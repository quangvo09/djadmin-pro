chrome.contextMenus.create({
  id: "DjadminPro",
  title: "Djadmin Pro",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "runProMod" });
  });
});
