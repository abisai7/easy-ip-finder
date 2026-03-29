export interface PopupMessages {
	title: string;
	copyToClipboardAction: string;
	copyConfigText: string;
	genericErrorMessage: string;
	changeVersionToShowText: string;
	yourCurrentCountryMessage: string;
	ispMessage: string;
	rateUsMessage: string;
	authorMessage: string;
	ipCopiedText: string;
	privacyInfoBtnTitle: string;
	privacyInfoMessage: string;
}

export const getPopupMessages = (): PopupMessages => ({
	title: chrome.i18n.getMessage("extName"),
	copyToClipboardAction: chrome.i18n.getMessage("copyToClipboardAction"),
	copyConfigText: chrome.i18n.getMessage("copyConfigText"),
	genericErrorMessage: chrome.i18n.getMessage("genericErrorMessage"),
	changeVersionToShowText: chrome.i18n.getMessage("changeVersionToShowText"),
	yourCurrentCountryMessage: chrome.i18n.getMessage(
		"yourCurrentCountryMessage",
	),
	ispMessage: chrome.i18n.getMessage("ispMessage"),
	rateUsMessage: chrome.i18n.getMessage("rateUsMessage"),
	authorMessage: chrome.i18n.getMessage("authorMessage"),
	ipCopiedText: chrome.i18n.getMessage("ipCopiedText"),
	privacyInfoBtnTitle: chrome.i18n.getMessage("privacyInfoBtnTitle"),
	privacyInfoMessage: chrome.i18n.getMessage("privacyInfoMessage"),
});
