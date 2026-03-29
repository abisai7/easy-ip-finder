const primaryLogo: string = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
  <path fill="none" d="M12 2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm-2 3H8v6h1V9.014h1c.298-.013 2 0 2-2.018 0-1.74-1.314-1.952-1.825-1.987zM6 5H5v6h1zm4 .984c.667 0 1 .336 1 1.008C11 7.664 10.667 8 10 8H9V5.984z"/>
</svg>`;

const copyLogo: string = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <path fill="currentColor" d="M22.6 4h-1.05a3.89 3.89 0 00-7.31 0h-.84A2.41 2.41 0 0011 6.4V10h14V6.4A2.41 2.41 0 0022.6 4m.4 4H13V6.25a.25.25 0 01.25-.25h2.69l.12-1.11a1.24 1.24 0 01.55-.89 2 2 0 013.15 1.18l.09.84h2.9a.25.25 0 01.25.25z"/>
  <path fill="currentColor" d="M33.25 18.06H21.33l2.84-2.83a1 1 0 10-1.42-1.42l-5.25 5.25 5.25 5.25a1 1 0 00.71.29 1 1 0 00.71-1.7l-2.84-2.84h11.92a1 1 0 000-2"/>
  <path fill="currentColor" d="M29 16h2V6.68A1.66 1.66 0 0029.35 5h-2.27v2H29z"/>
  <path fill="currentColor" d="M29 31H7V7h2V5H6.64A1.66 1.66 0 005 6.67v24.65A1.66 1.66 0 006.65 33h22.71A1.66 1.66 0 0031 31.33v-9.27h-2z"/>
  <path fill="none" d="M0 0h36v36H0z"/>
</svg>`;

export interface PopupTemplateParams {
	title: string;
	copyToClipboardAction: string;
	copyConfigText: string;
	rateUsMessage: string;
	authorMessage: string;
	privacyInfoBtnTitle: string;
	privacyInfoMessage: string;
}

export const renderPopupTemplate = ({
	title,
	copyToClipboardAction,
	copyConfigText,
	rateUsMessage,
	authorMessage,
	privacyInfoBtnTitle,
	privacyInfoMessage,
}: PopupTemplateParams): string => /* html */ `
<section class="top-section">
  <div class="logo">   
    ${primaryLogo}
    <h1>${title}</h1>
  </div>
  <button class="change-version-btn" title="${copyToClipboardAction}">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M42 19H6M30 7l12 12M6.799 29h36m-36 0l12 12"/>
    </svg> 
    <span class="change-version-btn-text"></span>
  </button>
</section>

<section class="ip-section">
<div class="ip-container">  
<div class="lds-loading">
    <div></div>
    <div></div>
    <div></div>
  </div>
  <h1>
    <x-ip class="hide"></x-ip>
  </h1>
  <button class="copy-to-clipboard-btn hide" title="${copyToClipboardAction}">
    ${copyLogo}
  </button>
  <div class="error hide"></div>
  </div>
  <div class="more-ip-info hide"></div>
</section>

<section class="config-section">
  <div class="clipboard-config">
    <input class="toggle-input" type="checkbox" id="clipboard-config-check" />
    <label for="clipboard-config-check" class="toggle-button"><span>${copyConfigText}</span></label>
  </div>
</section>
<section class="author-section">
  <p>${rateUsMessage}</p>
  <p>${authorMessage}</p>
</section>

<button class="privacy-info-btn" title="${privacyInfoBtnTitle}" aria-label="${privacyInfoBtnTitle}">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
</button>
<div class="privacy-info-panel hide" role="status" aria-live="polite">
  <p>${privacyInfoMessage}</p>
</div>
`;
