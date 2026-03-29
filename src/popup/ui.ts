import type { IPLocationData } from "../services/ip/location";

export interface PopupUIElements {
	clipboardConfigCheck: HTMLInputElement;
	changeVersionButton: HTMLButtonElement;
	changeVersionButtonText: HTMLElement;
	copyToClipboardButton: HTMLElement;
	loader: HTMLElement;
	error: HTMLElement;
	ip: HTMLElement;
	moreIpInfo: HTMLElement;
}

export interface PopupUIMessages {
	changeVersionToShowText: string;
	yourCurrentCountryMessage: string;
	ispMessage: string;
}

export interface PopupUI {
	clearError: () => void;
	clearLocationData: () => void;
	resetBeforeRender: () => void;
	showCopyToClipboardAction: () => void;
	hideCopyToClipboardAction: () => void;
	setLoading: (show?: boolean) => void;
	renderError: (errorMessage: string) => void;
	showIp: (ip: string) => void;
	hideIp: () => void;
	renderIPLocationData: (ipLocationData: IPLocationData | null) => void;
	updateVersionToggleText: (version: number) => void;
	setVersionButtonDisabled: (disabled: boolean) => void;
	setCopyOnLoadChecked: (checked: boolean) => void;
}

export const createPopupUI = (elements: PopupUIElements, messages: PopupUIMessages, regionNames: Intl.DisplayNames): PopupUI => {
	const toggleVisibility = (element: HTMLElement, show: boolean): void => {
		element.classList.toggle("show", show);
		element.classList.toggle("hide", !show);
	};

	const clearError = (): void => {
		elements.error.textContent = "";
		elements.error.classList.add("hide");
	};

	const clearLocationData = (): void => {
		elements.moreIpInfo.innerHTML = "";
		elements.moreIpInfo.classList.add("hide");
	};

	const resetBeforeRender = (): void => {
		clearError();
		clearLocationData();
		hideIp();
		hideCopyToClipboardAction();
	};

	const showCopyToClipboardAction = (): void => {
		toggleVisibility(elements.copyToClipboardButton, true);
	};

	const hideCopyToClipboardAction = (): void => {
		toggleVisibility(elements.copyToClipboardButton, false);
	};

	const setLoading = (show: boolean = true): void => {
		toggleVisibility(elements.loader, show);
	};

	const renderError = (errorMessage: string): void => {
		elements.error.textContent = `${errorMessage}`;
		elements.error.classList.remove("hide");
	};

	const showIp = (ip: string): void => {
		elements.ip.innerText = ip;
		toggleVisibility(elements.ip, true);
	};

	const hideIp = (): void => {
		toggleVisibility(elements.ip, false);
	};

	const renderIPLocationData = (ipLocationData: IPLocationData | null): void => {
		if (!ipLocationData) {
			return;
		}

		const fragment = document.createDocumentFragment();

		if (ipLocationData.country) {
			const countryCode = ipLocationData.country;
			const countryName = regionNames.of(countryCode);

			const countryInfoP = document.createElement("p");
			countryInfoP.classList.add("more-info");
			const countryLabel = document.createTextNode(
				`${messages.yourCurrentCountryMessage}: `,
			);
			const countryValue = document.createElement("span");
			countryValue.classList.add("detail-info");
			countryValue.textContent = countryName || countryCode;
			countryInfoP.append(countryLabel, countryValue);
			fragment.append(countryInfoP);
		}

		if (ipLocationData.asn?.organization) {
			const ispInfoP = document.createElement("p");
			ispInfoP.classList.add("more-info");
			const ispLabel = document.createTextNode(`${messages.ispMessage}: `);
			const ispValue = document.createElement("span");
			ispValue.classList.add("detail-info");
			ispValue.textContent = ipLocationData.asn.organization;
			ispInfoP.append(ispLabel, ispValue);
			fragment.append(ispInfoP);
		}

		if (fragment.childNodes.length > 0) {
			elements.moreIpInfo.append(fragment);
			elements.moreIpInfo.classList.remove("hide");
		}
	};

	const updateVersionToggleText = (version: number): void => {
		elements.changeVersionButtonText.innerText =
			messages.changeVersionToShowText.replace("{v}", String(version === 4 ? 6 : 4));
	};

	const setVersionButtonDisabled = (disabled: boolean): void => {
		elements.changeVersionButton.disabled = disabled;
	};

	const setCopyOnLoadChecked = (checked: boolean): void => {
		elements.clipboardConfigCheck.checked = checked;
	};

	return {
		clearError,
		clearLocationData,
		resetBeforeRender,
		showCopyToClipboardAction,
		hideCopyToClipboardAction,
		setLoading,
		renderError,
		showIp,
		hideIp,
		renderIPLocationData,
		updateVersionToggleText,
		setVersionButtonDisabled,
		setCopyOnLoadChecked,
	};
};
