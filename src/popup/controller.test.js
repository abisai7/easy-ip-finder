import { describe, expect, it, beforeEach, vi } from "vitest";
import { createPopupController } from "./controller";

const flushPromises = async () => {
	await Promise.resolve();
	await Promise.resolve();
};

const deferred = () => {
	let resolve;
	const promise = new Promise((res) => {
		resolve = res;
	});
	return { promise, resolve };
};

const createElements = () => {
	const clipboardConfigCheck = document.createElement("input");
	clipboardConfigCheck.type = "checkbox";
	const changeVersionButton = document.createElement("button");
	const copyToClipboardButton = document.createElement("button");

	return {
		clipboardConfigCheck,
		changeVersionButton,
		copyToClipboardButton,
	};
};

const createUiMock = () => ({
	setVersionButtonDisabled: vi.fn(),
	setLoading: vi.fn(),
	resetBeforeRender: vi.fn(),
	setCopyOnLoadChecked: vi.fn(),
	renderError: vi.fn(),
	showIp: vi.fn(),
	updateVersionToggleText: vi.fn(),
	showCopyToClipboardAction: vi.fn(),
	renderIPLocationData: vi.fn(),
});

describe("createPopupController", () => {
	let elements;
	let ui;
	let popupStorage;
	let ipTracker;
	let ipLocation;
	let controller;
	let onCopyNotification;

	beforeEach(() => {
		elements = createElements();
		ui = createUiMock();
		popupStorage = {
			getCopyToClipboardOnLoad: vi.fn().mockResolvedValue(true),
			setCopyToClipboardOnLoad: vi.fn().mockResolvedValue(undefined),
			getVersionConfig: vi.fn().mockResolvedValue(4),
			setVersionConfig: vi.fn().mockResolvedValue(undefined),
		};
		ipTracker = {
			init: vi.fn().mockResolvedValue({ ip: "1.1.1.1", error: "" }),
			copyToClipboard: vi.fn(),
		};
		ipLocation = {
			fetchLocationData: vi.fn().mockResolvedValue({ country: "US" }),
		};
		onCopyNotification = vi.fn();

		controller = createPopupController({
			elements,
			ui,
			popupStorage,
			ipTracker,
			ipLocation,
			genericErrorMessage: "Error:",
			onCopyNotification,
		});
	});

	it("initializes and renders a successful state", async () => {
		await controller.init();

		expect(popupStorage.getVersionConfig).toHaveBeenCalledTimes(1);
		expect(popupStorage.getCopyToClipboardOnLoad).toHaveBeenCalledTimes(1);
		expect(ipTracker.init).toHaveBeenCalledWith(4, true, onCopyNotification);
		expect(ui.showIp).toHaveBeenCalledWith("1.1.1.1");
		expect(ui.updateVersionToggleText).toHaveBeenCalledWith(4);
		expect(ui.showCopyToClipboardAction).toHaveBeenCalledTimes(1);
		expect(ui.renderIPLocationData).toHaveBeenCalledWith({ country: "US" });
		expect(ui.setLoading).toHaveBeenNthCalledWith(1, true);
		expect(ui.setLoading).toHaveBeenLastCalledWith(false);
	});

	it("shows a composed error when IP cannot be resolved", async () => {
		ipTracker.init.mockResolvedValueOnce({ ip: null, error: "network" });

		await controller.init();

		expect(ui.renderError).toHaveBeenCalledWith("Error: network");
		expect(ui.showIp).not.toHaveBeenCalled();
	});

	it("binds and handles settings/version/copy events", async () => {
		await controller.init();
		controller.bindEvents();

		elements.clipboardConfigCheck.checked = true;
		elements.clipboardConfigCheck.dispatchEvent(new Event("change"));
		await flushPromises();

		expect(popupStorage.setCopyToClipboardOnLoad).toHaveBeenCalledWith(true);

		elements.changeVersionButton.dispatchEvent(new Event("click"));
		await flushPromises();

		expect(popupStorage.getVersionConfig).toHaveBeenCalled();
		expect(popupStorage.setVersionConfig).toHaveBeenCalledWith(6);
		expect(ipTracker.init).toHaveBeenLastCalledWith(
			6,
			true,
			onCopyNotification,
		);

		elements.copyToClipboardButton.dispatchEvent(new Event("click"));
		expect(ipTracker.copyToClipboard).toHaveBeenCalledWith(
			"1.1.1.1",
			onCopyNotification,
		);
	});

	it("ignores rapid repeated version-clicks while render is in progress", async () => {
		const pendingInit = deferred();
		ipTracker.init.mockImplementationOnce(() => pendingInit.promise);
		controller.bindEvents();

		elements.changeVersionButton.dispatchEvent(new Event("click"));
		elements.changeVersionButton.dispatchEvent(new Event("click"));
		await flushPromises();

		expect(popupStorage.getVersionConfig).toHaveBeenCalledTimes(1);
		expect(popupStorage.setVersionConfig).toHaveBeenCalledTimes(1);
		expect(ipTracker.init).toHaveBeenCalledTimes(1);

		pendingInit.resolve({ ip: "2.2.2.2", error: "" });
		await flushPromises();
	});
});
