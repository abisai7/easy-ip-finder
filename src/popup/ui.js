export const createPopupUI = (elements, messages, regionNames) => {
	const toggleVisibility = (element, show) => {
		element.classList.toggle("show", show);
		element.classList.toggle("hide", !show);
	};

	const clearError = () => {
		elements.error.textContent = "";
		elements.error.classList.add("hide");
	};

	const clearLocationData = () => {
		elements.moreIpInfo.innerHTML = "";
		elements.moreIpInfo.classList.add("hide");
	};

	const resetBeforeRender = () => {
		clearError();
		clearLocationData();
		hideIp();
		hideCopyToClipboardAction();
	};

	const showCopyToClipboardAction = () => {
		toggleVisibility(elements.copyToClipboardButton, true);
	};

	const hideCopyToClipboardAction = () => {
		toggleVisibility(elements.copyToClipboardButton, false);
	};

	const setLoading = (show = true) => {
		toggleVisibility(elements.loader, show);
	};

	const renderError = (errorMessage) => {
		elements.error.textContent = `${errorMessage}`;
		elements.error.classList.remove("hide");
	};

	const showIp = (ip) => {
		elements.ip.innerText = ip;
		toggleVisibility(elements.ip, true);
	};

	const hideIp = () => {
		toggleVisibility(elements.ip, false);
	};

	const renderIPLocationData = (ipLocationData) => {
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

	const updateVersionToggleText = (version) => {
		elements.changeVersionButtonText.innerText =
			messages.changeVersionToShowText.replace("{v}", version === 4 ? 6 : 4);
	};

	const setVersionButtonDisabled = (disabled) => {
		elements.changeVersionButton.disabled = disabled;
	};

	const setCopyOnLoadChecked = (checked) => {
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
