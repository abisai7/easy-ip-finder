import { DEFAULT_SETTINGS, STORAGE_KEYS, type IPVersion } from "../shared/settings";

export interface PopupStorage {
	getCopyToClipboardOnLoad(): Promise<boolean>;
	setCopyToClipboardOnLoad(checked: boolean): Promise<void>;
	getVersionConfig(): Promise<IPVersion>;
	setVersionConfig(version: IPVersion): Promise<void>;
}

export const popupStorage: PopupStorage = {
	async getCopyToClipboardOnLoad(): Promise<boolean> {
		const config = await chrome.storage.sync.get([
			STORAGE_KEYS.copyToClipboardOnLoad,
		]);
		return (
			(config[STORAGE_KEYS.copyToClipboardOnLoad] as boolean | undefined) ??
			DEFAULT_SETTINGS.copyToClipboardOnLoad
		);
	},

	async setCopyToClipboardOnLoad(checked: boolean): Promise<void> {
		await chrome.storage.sync.set({
			[STORAGE_KEYS.copyToClipboardOnLoad]: checked,
		});
	},

	async getVersionConfig(): Promise<IPVersion> {
		const config = await chrome.storage.sync.get([STORAGE_KEYS.versionConfig]);
		return (config[STORAGE_KEYS.versionConfig] as IPVersion | undefined) ?? DEFAULT_SETTINGS.versionConfig;
	},

	async setVersionConfig(version: IPVersion): Promise<void> {
		await chrome.storage.sync.set({ [STORAGE_KEYS.versionConfig]: version });
	},
};
