import "./style.css";
/* import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg"; */
import { iptracker } from "../iptracker/iptracker";

document.querySelector("#app").innerHTML = `
<section class="top-section">
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="40"
  height="40"
  viewBox="0 0 16 16"
>
  <path
    fill="none"
    d="M12 2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm-2 3H8v6h1V9.014h1c.298-.013 2 0 2-2.018c0-1.74-1.314-1.952-1.825-1.987zM6 5H5v6h1zm4 .984c.667 0 1 .336 1 1.008C11 7.664 10.667 8 10 8H9V5.984Z"
  />
</svg>
<h1>EASY IP FINDER</h1>
</section>

<section class="ip-container">
<div class="lds-loading">
  <div></div>
  <div></div>
  <div></div>
</div>
<h1>
  <x-ip class="hide"></x-ip>
</h1>
<button class="copy-to-clipboard-btn" title="Copy IP to Clipboard">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
    <path
      fill="currentColor"
      d="M22.6 4h-1.05a3.89 3.89 0 0 0-7.31 0h-.84A2.41 2.41 0 0 0 11 6.4V10h14V6.4A2.41 2.41 0 0 0 22.6 4m.4 4H13V6.25a.25.25 0 0 1 .25-.25h2.69l.12-1.11a1.24 1.24 0 0 1 .55-.89a2 2 0 0 1 3.15 1.18l.09.84h2.9a.25.25 0 0 1 .25.25Z"
      class="clr-i-outline clr-i-outline-path-1"
    />
    <path
      fill="currentColor"
      d="M33.25 18.06H21.33l2.84-2.83a1 1 0 1 0-1.42-1.42l-5.25 5.25l5.25 5.25a1 1 0 0 0 .71.29a1 1 0 0 0 .71-1.7l-2.84-2.84h11.92a1 1 0 0 0 0-2"
      class="clr-i-outline clr-i-outline-path-2"
    />
    <path
      fill="currentColor"
      d="M29 16h2V6.68A1.66 1.66 0 0 0 29.35 5h-2.27v2H29Z"
      class="clr-i-outline clr-i-outline-path-3"
    />
    <path
      fill="currentColor"
      d="M29 31H7V7h2V5H6.64A1.66 1.66 0 0 0 5 6.67v24.65A1.66 1.66 0 0 0 6.65 33h22.71A1.66 1.66 0 0 0 31 31.33v-9.27h-2Z"
      class="clr-i-outline clr-i-outline-path-4"
    />
    <path fill="none" d="M0 0h36v36H0z" />
  </svg>
</button>
<div class="error hide"></div>
</section>

<section class="config-section">
<div class="clipboard-config">
  <input
    class="toggle-input"
    type="checkbox"
    id="clipboard-config-check"
  />
  <label for="clipboard-config-check" class="toggle-button"
    ><span>Copy IP to clipboard when opening the popup</span></label
  >
</div>
</section>
`;

document
  .querySelector("#clipboard-config-check")
  .addEventListener("change", async (event) => {
    chrome.storage.sync.set({
      copyToClipboardOnLoad: event.target.checked,
    });
  });

document.addEventListener("DOMContentLoaded", iptracker.init);
