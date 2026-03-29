export const STORAGE_KEYS = {
	copyToClipboardOnLoad: "copyToClipboardOnLoad",
	versionConfig: "versionConfig",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const IP_VERSIONS = {
	v4: 4,
	v6: 6,
} as const;

export type IPVersion = (typeof IP_VERSIONS)[keyof typeof IP_VERSIONS];

export interface Settings {
	copyToClipboardOnLoad: boolean;
	versionConfig: IPVersion;
}

export const DEFAULT_SETTINGS: Settings = {
	copyToClipboardOnLoad: true,
	versionConfig: IP_VERSIONS.v4,
};
