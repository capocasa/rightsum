chrome.storage.local.get("pendingPrompt", (result) => {
  if (!result.pendingPrompt) return;

  const prompt = result.pendingPrompt;
  chrome.storage.local.remove("pendingPrompt");

  function tryFillPrompt() {
    const el =
      document.querySelector(".ql-editor") ||
      document.querySelector("rich-textarea .ql-editor") ||
      document.querySelector('div[contenteditable="true"]') ||
      document.querySelector("textarea");

    if (!el) return false;

    el.focus();

    if (el.tagName === "TEXTAREA") {
      el.value = prompt;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      // Clear existing content and use execCommand to simulate real typing
      el.textContent = "";
      document.execCommand("insertText", false, prompt);
    }

    return el;
  }

  function submit() {
    setTimeout(() => {
      const sendBtn = document.querySelector("button.send-button");
      if (sendBtn) {
        sendBtn.click();
      }
    }, 500);
  }

  const el = tryFillPrompt();
  if (el) { submit(); return; }

  const observer = new MutationObserver((_mutations, obs) => {
    const filled = tryFillPrompt();
    if (filled) {
      obs.disconnect();
      submit();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 15000);
});
