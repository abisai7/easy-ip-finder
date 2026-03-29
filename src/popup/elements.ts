export interface PopupElements {
	clipboardConfigCheck: HTMLInputElement;
	changeVersionButton: HTMLButtonElement;
	changeVersionButtonText: HTMLSpanElement;
	copyToClipboardButton: HTMLButtonElement;
	loader: HTMLDivElement;
	error: HTMLDivElement;
	ip: HTMLElement;
	moreIpInfo: HTMLDivElement;
	privacyInfoButton: HTMLButtonElement;
	privacyInfoPanel: HTMLDivElement;
}

export const getPopupElements = (): PopupElements => ({
	clipboardConfigCheck: document.querySelector("#clipboard-config-check") as HTMLInputElement,
	changeVersionButton: document.querySelector(".change-version-btn") as HTMLButtonElement,
	changeVersionButtonText: document.querySelector(".change-version-btn-text") as HTMLSpanElement,
	copyToClipboardButton: document.querySelector(".copy-to-clipboard-btn") as HTMLButtonElement,
	loader: document.querySelector(".lds-loading") as HTMLDivElement,
	error: document.querySelector(".error") as HTMLDivElement,
	ip: document.querySelector("x-ip") as HTMLElement,
	moreIpInfo: document.querySelector(".more-ip-info") as HTMLDivElement,
	privacyInfoButton: document.querySelector(".privacy-info-btn") as HTMLButtonElement,
	privacyInfoPanel: document.querySelector(".privacy-info-panel") as HTMLDivElement,
});
