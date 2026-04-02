import { describe, expect, it, beforeEach } from "vitest";
import { createPopupUI, type PopupUI, type PopupUIElements } from "./ui";

const makeElements = (): PopupUIElements => {
	document.body.innerHTML = `
    <input id="check" type="checkbox" />
    <button id="change"></button>
    <span id="change-text"></span>
    <button id="copy" class="hide"></button>
    <div id="loader"></div>
    <div id="error" class="hide"></div>
    <x-ip id="ip" class="show">old</x-ip>
    <div id="more-info" class="hide"><p>old row</p></div>
  `;

	return {
		clipboardConfigCheck: document.querySelector("#check") as HTMLInputElement,
		changeVersionButton: document.querySelector("#change") as HTMLButtonElement,
		changeVersionButtonText: document.querySelector(
			"#change-text",
		) as HTMLSpanElement,
		copyToClipboardButton: document.querySelector("#copy") as HTMLButtonElement,
		loader: document.querySelector("#loader") as HTMLDivElement,
		error: document.querySelector("#error") as HTMLDivElement,
		ip: document.querySelector("#ip") as HTMLElement,
		moreIpInfo: document.querySelector("#more-info") as HTMLDivElement,
	};
};

describe("createPopupUI", () => {
	let elements: PopupUIElements;
	let ui: PopupUI;

	beforeEach(() => {
		elements = makeElements();
		ui = createPopupUI(
			elements,
			{
				changeVersionToShowText: "Show v{v}",
				yourCurrentCountryMessage: "Country",
				ispMessage: "ISP",
			},
			{
				of: (countryCode: string) =>
					countryCode === "US" ? "United States" : countryCode,
				resolvedOptions: () => ({
					locale: "en",
					style: "long" as const,
					type: "region" as const,
					fallback: "code" as const,
				}),
			} as Intl.DisplayNames,
		);
	});

	it("resets transient UI state before render", () => {
		elements.error.textContent = "some error";
		elements.moreIpInfo.innerHTML = "<p>stale</p>";

		ui.resetBeforeRender();

		expect(elements.error.textContent).toBe("");
		expect(elements.error.classList.contains("hide")).toBe(true);
		expect(elements.moreIpInfo.innerHTML).toBe("");
		expect(elements.moreIpInfo.classList.contains("hide")).toBe(true);
		expect(elements.ip.classList.contains("hide")).toBe(true);
		expect(elements.copyToClipboardButton.classList.contains("hide")).toBe(
			true,
		);
	});

	it("renders location rows from API data", () => {
		ui.renderIPLocationData({
			country: "US",
			asn: { organization: "Cloudflare" },
		});

		expect(elements.moreIpInfo.classList.contains("hide")).toBe(false);
		expect(elements.moreIpInfo.querySelectorAll("p.more-info").length).toBe(2);
		expect(elements.moreIpInfo.textContent).toContain("Country: United States");
		expect(elements.moreIpInfo.textContent).toContain("ISP: Cloudflare");
	});

	it("updates version toggle label", () => {
		ui.updateVersionToggleText(4);
		expect(elements.changeVersionButtonText.innerText).toBe("Show v6");

		ui.updateVersionToggleText(6);
		expect(elements.changeVersionButtonText.innerText).toBe("Show v4");
	});
});
