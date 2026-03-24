import { DEFAULT_SETTINGS, STORAGE_KEYS } from "../shared/settings";

export const popupStorage = {
	async getCopyToClipboardOnLoad() {
		const config = await chrome.storage.sync.get([
			STORAGE_KEYS.copyToClipboardOnLoad,
		]);
		return (
			config[STORAGE_KEYS.copyToClipboardOnLoad] ??
			DEFAULT_SETTINGS.copyToClipboardOnLoad
		);
	},

	async setCopyToClipboardOnLoad(checked) {
		await chrome.storage.sync.set({
			[STORAGE_KEYS.copyToClipboardOnLoad]: checked,
		});
	},

	async getVersionConfig() {
		const config = await chrome.storage.sync.get([STORAGE_KEYS.versionConfig]);
		return config[STORAGE_KEYS.versionConfig] ?? DEFAULT_SETTINGS.versionConfig;
	},

	async setVersionConfig(version) {
		await chrome.storage.sync.set({ [STORAGE_KEYS.versionConfig]: version });
	},
};
