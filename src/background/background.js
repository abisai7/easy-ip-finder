// Set default config
chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.sync.set({
    copyToClipboardOnLoad: true,
  })
})
