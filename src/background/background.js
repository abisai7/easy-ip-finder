// Set default config
chrome.runtime.onInstalled.addListener(async () => {
  const config = await chrome.storage.sync.get(['copyToClipboardOnLoad'])

  if (config.copyToClipboardOnLoad === undefined) {
    chrome.storage.sync.set({
      copyToClipboardOnLoad: true,
    })
  }
})
