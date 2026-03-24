import { IP_VERSIONS } from "../shared/settings";

export const createPopupController = ({
	elements,
	ui,
	popupStorage,
	ipTracker,
	ipLocation,
	genericErrorMessage,
	onCopyNotification,
}) => {
	let currentIP = null;
	let activeRenderId = 0;
	let isRendering = false;
	let isVersionSwitching = false;

	const renderIPLocationData = async (renderId, ip) => {
		const ipLocationData = await ipLocation.fetchLocationData(ip);
		if (renderId !== activeRenderId || !ipLocationData) {
			return;
		}

		ui.renderIPLocationData(ipLocationData);
	};

	const renderIP = async (version = 4) => {
		const renderId = ++activeRenderId;
		isRendering = true;
		ui.setVersionButtonDisabled(true);
		ui.setLoading(true);
		ui.resetBeforeRender();

		try {
			const shouldCopyOnLoad = await popupStorage.getCopyToClipboardOnLoad();
			ui.setCopyOnLoadChecked(shouldCopyOnLoad);

			const ipResult = await ipTracker.init(
				version,
				shouldCopyOnLoad,
				onCopyNotification,
			);

			if (renderId !== activeRenderId) {
				return;
			}

			if (ipResult.ip == null) {
				ui.renderError(`${genericErrorMessage} ${ipResult.error}`);
				return;
			}

			currentIP = ipResult.ip;
			ui.showIp(ipResult.ip);
			ui.updateVersionToggleText(version);
			ui.showCopyToClipboardAction();
			await renderIPLocationData(renderId, currentIP);
		} finally {
			if (renderId === activeRenderId) {
				ui.setLoading(false);
				ui.setVersionButtonDisabled(false);
				isRendering = false;
			}
		}
	};

	const bindEvents = () => {
		elements.clipboardConfigCheck.addEventListener("change", async (event) => {
			await popupStorage.setCopyToClipboardOnLoad(event.target.checked);
		});

		elements.changeVersionButton.addEventListener("click", async () => {
			if (isRendering || isVersionSwitching) {
				return;
			}

			isVersionSwitching = true;
			try {
				const currentVersion = await popupStorage.getVersionConfig();
				const changeToVersion =
					currentVersion === IP_VERSIONS.v4 ? IP_VERSIONS.v6 : IP_VERSIONS.v4;
				await popupStorage.setVersionConfig(changeToVersion);
				await renderIP(changeToVersion);
			} finally {
				isVersionSwitching = false;
			}
		});

		elements.copyToClipboardButton.addEventListener("click", () => {
			ipTracker.copyToClipboard(currentIP, onCopyNotification);
		});
	};

	const init = async () => {
		const version = await popupStorage.getVersionConfig();
		await renderIP(version);
	};

	return {
		bindEvents,
		init,
	};
};
