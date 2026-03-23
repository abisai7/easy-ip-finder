import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../shared/settings'

// Set default config
chrome.runtime.onInstalled.addListener(async () => {
  const config = await chrome.storage.sync.get([
    STORAGE_KEYS.copyToClipboardOnLoad,
    STORAGE_KEYS.versionConfig,
  ])

  const updates = {}

  if (config[STORAGE_KEYS.copyToClipboardOnLoad] === undefined) {
    updates[STORAGE_KEYS.copyToClipboardOnLoad] =
      DEFAULT_SETTINGS.copyToClipboardOnLoad
  }

  if (config[STORAGE_KEYS.versionConfig] === undefined) {
    updates[STORAGE_KEYS.versionConfig] = DEFAULT_SETTINGS.versionConfig
  }

  if (Object.keys(updates).length > 0) {
    await chrome.storage.sync.set(updates)
  }
})
