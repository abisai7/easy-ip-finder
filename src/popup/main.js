import './style.css'
import { ipTracker } from '../iptracker/iptracker'

const primaryLogo =
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16"><path fill="none" d="M12 2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm-2 3H8v6h1V9.014h1c.298-.013 2 0 2-2.018 0-1.74-1.314-1.952-1.825-1.987zM6 5H5v6h1zm4 .984c.667 0 1 .336 1 1.008C11 7.664 10.667 8 10 8H9V5.984z"/></svg>'
const copyLogo =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="currentColor" d="M22.6 4h-1.05a3.89 3.89 0 00-7.31 0h-.84A2.41 2.41 0 0011 6.4V10h14V6.4A2.41 2.41 0 0022.6 4m.4 4H13V6.25a.25.25 0 01.25-.25h2.69l.12-1.11a1.24 1.24 0 01.55-.89 2 2 0 013.15 1.18l.09.84h2.9a.25.25 0 01.25.25z" class="prefix__clr-i-outline prefix__clr-i-outline-path-1"/><path fill="currentColor" d="M33.25 18.06H21.33l2.84-2.83a1 1 0 10-1.42-1.42l-5.25 5.25 5.25 5.25a1 1 0 00.71.29 1 1 0 00.71-1.7l-2.84-2.84h11.92a1 1 0 000-2" class="prefix__clr-i-outline prefix__clr-i-outline-path-2"/><path fill="currentColor" d="M29 16h2V6.68A1.66 1.66 0 0029.35 5h-2.27v2H29z" class="prefix__clr-i-outline prefix__clr-i-outline-path-3"/><path fill="currentColor" d="M29 31H7V7h2V5H6.64A1.66 1.66 0 005 6.67v24.65A1.66 1.66 0 006.65 33h22.71A1.66 1.66 0 0031 31.33v-9.27h-2z" class="prefix__clr-i-outline prefix__clr-i-outline-path-4"/><path fill="none" d="M0 0h36v36H0z"/></svg>'
const title = 'EASY IP FINDER'
const copyToClipboardAction = 'Copy IP to Clipboard'
const copyConfigText = 'Copy IP to clipboard when opening the popup'
const genericErrorMessage =
  'An error has occurred, sorry for the inconvenience. Please try again. Reference: '
const template = /*html*/ `

<section class="top-section">
  ${primaryLogo}
  <h1>${title}</h1>
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
  <button class="copy-to-clipboard-btn hide" title="${copyToClipboardAction}">
    ${copyLogo}
  </button>
  <div class="error hide"></div>
</section>

<section class="config-section">
  <div class="clipboard-config">
    <input class="toggle-input" type="checkbox" id="clipboard-config-check" />
    <label for="clipboard-config-check" class="toggle-button"><span>${copyConfigText}</span></label>
  </div>
</section>
`

document.querySelector('#app').innerHTML = template

function setCopyToClipboard(checked) {
  chrome.storage.sync.set({
    copyToClipboardOnLoad: checked,
  })
}

document
  .querySelector('#clipboard-config-check')
  .addEventListener('change', async (event) => {
    setCopyToClipboard(event.target.checked)
  })

const renderIP = async () => {
  showLoading()
  const config = await chrome.storage.sync.get(['copyToClipboardOnLoad'])
  document.querySelector('#clipboard-config-check').checked =
    config.copyToClipboardOnLoad

  const ipResult = await ipTracker.init(4, config.copyToClipboardOnLoad, showNotification)

  if (ipResult.ip == null) {
    hideLoading()
    return renderError(`${genericErrorMessage} ${ipResult.error}`)
  }

  showIp(ipResult.ip)
  hideLoading()
  showCopyToClipboardAction()
}

const showCopyToClipboardAction = () => {
  const copyToClipboardButton = document.querySelector('.copy-to-clipboard-btn')
  copyToClipboardButton.classList.remove('hide')
  copyToClipboardButton.classList.add('show')
}

const showLoading = () => {
  const loaderElement = document.querySelector('.lds-loading')
  loaderElement.classList.remove('hide')
  loaderElement.classList.add('show')
}

const hideLoading = () => {
  const loaderElement = document.querySelector('.lds-loading')
  loaderElement.classList.remove('show')
  loaderElement.classList.add('hide')
}

const renderError = (errorMessage) => {
  const errorElement = document.querySelector('.error')
  errorElement.innerHTML = `${errorMessage}`
  errorElement.classList.remove('hide')
}

const showIp = (ip) => {
  const ipElement = document.querySelector('x-ip')
  ipElement.innerText = ip
  ipElement.classList.remove('hide')
  ipElement.classList.add('show')
}

const showNotification = () => {
  let options = {
    type: "basic",
    title: "Easy IP Finder",
    message: `IP copied to the clipboard`,
    iconUrl: "/icon-128.png",
    silent: true,
  };
  chrome.notifications.create(options);
}

document.addEventListener('DOMContentLoaded', renderIP)
