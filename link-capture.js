document.addEventListener("click", (e) => {
  if (!e.altKey) return;

  const link = e.target.closest("a[href]");
  if (!link) return;

  e.preventDefault();
  e.stopPropagation();

  const prompt = `Summarize ${link.href}`;
  chrome.storage.local.set({ pendingPrompt: prompt }, () => {
    window.open("https://gemini.google.com/app", "_blank");
  });
}, true);
