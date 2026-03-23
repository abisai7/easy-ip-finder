export const popupStorage = {
  async getCopyToClipboardOnLoad() {
    const config = await chrome.storage.sync.get(['copyToClipboardOnLoad'])
    return config.copyToClipboardOnLoad ?? true
  },

  async setCopyToClipboardOnLoad(checked) {
    await chrome.storage.sync.set({ copyToClipboardOnLoad: checked })
  },

  async getVersionConfig() {
    const config = await chrome.storage.sync.get(['versionConfig'])
    return config.versionConfig ?? 4
  },

  async setVersionConfig(version) {
    await chrome.storage.sync.set({ versionConfig: version })
  },
}
