import { describe, expect, it, beforeEach } from "vitest";
import { createPopupUI } from "./ui";

const makeElements = () => {
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
		clipboardConfigCheck: document.querySelector("#check"),
		changeVersionButton: document.querySelector("#change"),
		changeVersionButtonText: document.querySelector("#change-text"),
		copyToClipboardButton: document.querySelector("#copy"),
		loader: document.querySelector("#loader"),
		error: document.querySelector("#error"),
		ip: document.querySelector("#ip"),
		moreIpInfo: document.querySelector("#more-info"),
	};
};

describe("createPopupUI", () => {
	let elements;
	let ui;

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
				of: (countryCode) =>
					countryCode === "US" ? "United States" : countryCode,
			},
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
