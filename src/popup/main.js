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

	if (!chrome?.notifications?.create) {
		showToastNotification(messages.ipCopiedText);
		return;
	}

	try {
		chrome.notifications.create(options, (notificationId) => {
			if (chrome.runtime?.lastError || !notificationId) {
				showToastNotification(messages.ipCopiedText);
			}
		});
	} catch {
		showToastNotification(messages.ipCopiedText);
	}
};

// Toast notification fallback for Firefox
const showToastNotification = (message) => {
	const toast = document.createElement("div");
	toast.textContent = message;
	toast.style.cssText = `
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #fed766;
		color: #272727;
		padding: 12px 20px;
		border-radius: 4px;
		font-size: 14px;
		font-weight: bold;
		z-index: 1000;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		animation: slideUp 0.3s ease-out;
	`;

	document.body.appendChild(toast);

	setTimeout(() => {
		toast.style.animation = "slideDown 0.3s ease-out";
		setTimeout(() => toast.remove(), 300);
	}, 2000);
};

// Add animations
if (!document.getElementById("toast-styles")) {
	const style = document.createElement("style");
	style.id = "toast-styles";
	style.textContent = `
		@keyframes slideUp {
			from {
				opacity: 0;
				transform: translateX(-50%) translateY(20px);
			}
			to {
				opacity: 1;
				transform: translateX(-50%) translateY(0);
			}
		}
		@keyframes slideDown {
			from {
				opacity: 1;
				transform: translateX(-50%) translateY(0);
			}
			to {
				opacity: 0;
				transform: translateX(-50%) translateY(20px);
			}
		}
	`;
	document.head.appendChild(style);
}

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
