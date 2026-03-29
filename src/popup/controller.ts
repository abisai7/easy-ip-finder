import { IP_VERSIONS, type IPVersion } from "../shared/settings";
import type { PopupUI } from "./ui";
import type { PopupStorage } from "./storage";
import type { IPLocationData } from "../services/ip/location";

interface PopupControllerElements {
	clipboardConfigCheck: HTMLInputElement;
	changeVersionButton: HTMLButtonElement;
	copyToClipboardButton: HTMLElement;
}

interface IPTrackerService {
	init(version: number, copyToClipboard: boolean, onCopy: (() => void) | null): Promise<{ ip: string | null; error: string }>;
	copyToClipboard(ip: string, onCopy: (() => void) | null): Promise<void>;
}

interface IPLocationService {
	fetchLocationData(ip: string): Promise<IPLocationData | null>;
}

interface PopupControllerDeps {
	elements: PopupControllerElements;
	ui: PopupUI;
	popupStorage: PopupStorage;
	ipTracker: IPTrackerService;
	ipLocation: IPLocationService;
	genericErrorMessage: string;
	onCopyNotification: () => void;
}

export interface PopupController {
	bindEvents: () => void;
	init: () => Promise<void>;
}

export const createPopupController = ({
	elements,
	ui,
	popupStorage,
	ipTracker,
	ipLocation,
	genericErrorMessage,
	onCopyNotification,
}: PopupControllerDeps): PopupController => {
	let currentIP: string | null = null;
	let activeRenderId: number = 0;
	let isRendering: boolean = false;
	let isVersionSwitching: boolean = false;

	const renderIPLocationData = async (renderId: number, ip: string): Promise<void> => {
		const ipLocationData = await ipLocation.fetchLocationData(ip);
		if (renderId !== activeRenderId || !ipLocationData) {
			return;
		}

		ui.renderIPLocationData(ipLocationData);
	};

	const renderIP = async (version: IPVersion = 4): Promise<void> => {
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

	const bindEvents = (): void => {
		elements.clipboardConfigCheck.addEventListener("change", async (event: Event) => {
			await popupStorage.setCopyToClipboardOnLoad((event.target as HTMLInputElement).checked);
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
			if (currentIP) {
				ipTracker.copyToClipboard(currentIP, onCopyNotification);
			}
		});
	};

	const init = async (): Promise<void> => {
		const version = await popupStorage.getVersionConfig();
		await renderIP(version);
	};

	return {
		bindEvents,
		init,
	};
};
