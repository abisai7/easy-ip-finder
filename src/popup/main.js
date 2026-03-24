import "./style.css";
import { ipTracker } from "../services/ip/tracker";
import { ipLocation } from "../services/ip/location";
import { popupStorage } from "./storage";
import { createPopupUI } from "./ui";
import { createPopupController } from "./controller";
import { renderPopupTemplate } from "./template";
import { getPopupElements } from "./elements";
import { getPopupMessages } from "./messages";

const messages = getPopupMessages();

document.querySelector("#app").innerHTML = renderPopupTemplate({
	title: messages.title,
	copyToClipboardAction: messages.copyToClipboardAction,
	copyConfigText: messages.copyConfigText,
	rateUsMessage: messages.rateUsMessage,
	authorMessage: messages.authorMessage,
	privacyInfoBtnTitle: messages.privacyInfoBtnTitle,
	privacyInfoMessage: messages.privacyInfoMessage,
});

const elements = getPopupElements();

const uiLanguage = chrome.i18n.getUILanguage();
const currentLang = uiLanguage.split(/[-_]/)[0];
const isRtlLanguage = ["ar", "he", "fa", "ur"].includes(currentLang);

document.documentElement.lang = uiLanguage;
document.documentElement.dir = isRtlLanguage ? "rtl" : "ltr";

const regionNames = new Intl.DisplayNames([currentLang], {
	type: "region",
});

const ui = createPopupUI(
	elements,
	{
		changeVersionToShowText: messages.changeVersionToShowText,
		yourCurrentCountryMessage: messages.yourCurrentCountryMessage,
		ispMessage: messages.ispMessage,
	},
	regionNames,
);

const showNotification = () => {
	const options = {
		type: "basic",
		title: messages.title,
		message: messages.ipCopiedText,
		iconUrl: "/icon128.png",
		silent: true,
	};
	chrome.notifications.create(options);
};

const controller = createPopupController({
	elements,
	ui,
	popupStorage,
	ipTracker,
	ipLocation,
	genericErrorMessage: messages.genericErrorMessage,
	onCopyNotification: showNotification,
});

controller.bindEvents();

elements.privacyInfoButton.addEventListener("click", () => {
	elements.privacyInfoPanel.classList.toggle("hide");
	elements.privacyInfoPanel.classList.toggle("show");
});

document.addEventListener("click", (event) => {
	const isPanelOpen = elements.privacyInfoPanel.classList.contains("show");

	if (!isPanelOpen) {
		return;
	}

	const clickedOnButton = elements.privacyInfoButton.contains(event.target);
	const clickedInsidePanel = elements.privacyInfoPanel.contains(event.target);

	if (clickedOnButton || clickedInsidePanel) {
		return;
	}

	elements.privacyInfoPanel.classList.remove("show");
	elements.privacyInfoPanel.classList.add("hide");
});

document.addEventListener("DOMContentLoaded", async () => {
	await controller.init();
});
