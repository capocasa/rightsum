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

  function waitForSendButton() {
    const sendBtn = document.querySelector("button.send-button:not([aria-disabled='true'])");
    if (sendBtn) {
      sendBtn.click();
      return;
    }
    const obs = new MutationObserver(() => {
      const btn = document.querySelector("button.send-button:not([aria-disabled='true'])");
      if (btn) {
        obs.disconnect();
        btn.click();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    setTimeout(() => obs.disconnect(), 15000);
  }

  function fillAndSubmit() {
    const el = tryFillPrompt();
    if (el) {
      setTimeout(waitForSendButton, 500);
      return true;
    }
    return false;
  }

  if (fillAndSubmit()) return;

  const observer = new MutationObserver((_mutations, obs) => {
    if (fillAndSubmit()) {
      obs.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 15000);
});
