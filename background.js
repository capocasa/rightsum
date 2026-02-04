chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize-with-gemini",
    title: "Summarize",
    contexts: ["link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize-with-gemini") {
    const prompt = `Summarize ${info.linkUrl}`;
    chrome.storage.local.set({ pendingPrompt: prompt }, () => {
      chrome.tabs.create({ url: "https://gemini.google.com/app" });
    });
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "openGemini") {
    chrome.storage.local.set({ pendingPrompt: msg.prompt }, () => {
      chrome.tabs.create({ url: "https://gemini.google.com/app" });
    });
  }
});
