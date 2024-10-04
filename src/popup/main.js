import './style.css'
import { ipTracker } from '../iptracker/iptracker'
import { ipLocation } from '../iplocation/iplocation'

let currentIP = null

const primaryLogo = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
  <path fill="none" d="M12 2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm-2 3H8v6h1V9.014h1c.298-.013 2 0 2-2.018 0-1.74-1.314-1.952-1.825-1.987zM6 5H5v6h1zm4 .984c.667 0 1 .336 1 1.008C11 7.664 10.667 8 10 8H9V5.984z"/>
</svg>`

const copyLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
  <path fill="currentColor" d="M22.6 4h-1.05a3.89 3.89 0 00-7.31 0h-.84A2.41 2.41 0 0011 6.4V10h14V6.4A2.41 2.41 0 0022.6 4m.4 4H13V6.25a.25.25 0 01.25-.25h2.69l.12-1.11a1.24 1.24 0 01.55-.89 2 2 0 013.15 1.18l.09.84h2.9a.25.25 0 01.25.25z"/>
  <path fill="currentColor" d="M33.25 18.06H21.33l2.84-2.83a1 1 0 10-1.42-1.42l-5.25 5.25 5.25 5.25a1 1 0 00.71.29 1 1 0 00.71-1.7l-2.84-2.84h11.92a1 1 0 000-2"/>
  <path fill="currentColor" d="M29 16h2V6.68A1.66 1.66 0 0029.35 5h-2.27v2H29z"/>
  <path fill="currentColor" d="M29 31H7V7h2V5H6.64A1.66 1.66 0 005 6.67v24.65A1.66 1.66 0 006.65 33h22.71A1.66 1.66 0 0031 31.33v-9.27h-2z"/>
  <path fill="none" d="M0 0h36v36H0z"/>
</svg>`

const title = chrome.i18n.getMessage('extName')
const copyToClipboardAction = chrome.i18n.getMessage('copyToClipboardAction')
const copyConfigText = chrome.i18n.getMessage('copyConfigText')
const genericErrorMessage = chrome.i18n.getMessage('genericErrorMessage')
const changeVersionToShowText = chrome.i18n.getMessage(
  'changeVersionToShowText'
)
const yourCurrentCountryMessage = chrome.i18n.getMessage('yourCurrentCountryMessage')
const ispMessage = chrome.i18n.getMessage('ispMessage')
const rateUsMessage = chrome.i18n.getMessage('rateUsMessage')
const authorMessage = chrome.i18n.getMessage('authorMessage')
const template = /* html */ `
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

<section class="ip-location-info-container hide">  
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
`

document.querySelector('#app').innerHTML = template

function setCopyToClipboard(checked) {
  chrome.storage.sync.set({ copyToClipboardOnLoad: checked })
}

function setVersionConfig(version) {
  chrome.storage.sync.set({
    versionConfig: version,
  })
}

document
  .querySelector('#clipboard-config-check')
  .addEventListener('change', async (event) => {
    setCopyToClipboard(event.target.checked)
  })

const renderIP = async (version = 4) => {
  loader(true)
  const config = await chrome.storage.sync.get(['copyToClipboardOnLoad'])
  document.querySelector('#clipboard-config-check').checked =
    config.copyToClipboardOnLoad

  const ipResult = await ipTracker.init(
    version,
    config.copyToClipboardOnLoad,
    showNotification
  )

  if (ipResult.ip == null) {
    loader(false)
    return renderError(`${genericErrorMessage} ${ipResult.error}`)
  }

  currentIP = ipResult.ip
  let currentVersion = await chrome.storage.sync.get(['versionConfig'])
  showIp(ipResult.ip)
  document.querySelector('.change-version-btn-text').innerText = chrome.i18n
    .getMessage('changeVersionToShowText')
    .replace('{v}', currentVersion.versionConfig === 4 ? 6 : 4)
  loader(false)
  showCopyToClipboardAction()
}

const renderIPLocationData = async (ip) => {
  const ipLocationData = await ipLocation.fetchLocationData(ip)
  if (ipLocationData) {
    
    const ipLocationContainer = document.querySelector('.ip-location-info-container')

    if (ipLocationData.country) {
      const currentLang = chrome.i18n.getUILanguage().slice(0,2)
      const countryName = ipLocationData.country.names[currentLang] ? ipLocationData.country.names[currentLang] : ipLocationData.country.names['en']  
      const isoCode = ipLocationData.country.iso_code
      const countryInfoP = document.createElement('p')
      countryInfoP.innerHTML = `${yourCurrentCountryMessage}: <span class="info">${countryName} (${isoCode})</span>`
      const ispInfoP = document.createElement('p')
      ispInfoP.innerHTML = `${ispMessage}: <span class="info">${ipLocationData.traits.isp}</span>`
      ipLocationContainer.append(countryInfoP)
      ipLocationContainer.append(ispInfoP)
      ipLocationContainer.classList.remove('hide')
    }

  }
}

const showCopyToClipboardAction = () => {
  const copyToClipboardButton = document.querySelector('.copy-to-clipboard-btn')
  copyToClipboardButton.classList.remove('hide')
  copyToClipboardButton.classList.add('show')
}

const loader = (show = true) => {
  const loaderElement = document.querySelector('.lds-loading')
  if (show) {
    loaderElement.classList.remove('hide')
    loaderElement.classList.add('show')
  } else {
    loaderElement.classList.remove('show')
    loaderElement.classList.add('hide')
  }
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

const hideIp = () => {
  const ipElement = document.querySelector('x-ip')
  ipElement.classList.remove('show')
  ipElement.classList.add('hide')
}

const showNotification = () => {
  const options = {
    type: 'basic',
    title: chrome.i18n.getMessage('extName'),
    message: chrome.i18n.getMessage('ipCopiedText'),
    iconUrl: '/icon128.png',
    silent: true,
  }
  chrome.notifications.create(options)
}

document
  .querySelector('.change-version-btn')
  .addEventListener('click', async () => {
    hideIp()
    let currentVersion = await chrome.storage.sync.get(['versionConfig'])
    let changeToVersion = currentVersion.versionConfig === 4 ? 6 : 4
    setVersionConfig(changeToVersion)
    renderIP(changeToVersion)
  })

document
  .querySelector('.copy-to-clipboard-btn')
  .addEventListener('click', () => {
    ipTracker.copyToClipboard(currentIP, showNotification)
  })

document.addEventListener('DOMContentLoaded', async () => {
  const versionConfig = await chrome.storage.sync.get(['versionConfig'])
  const version = versionConfig.versionConfig ? versionConfig.versionConfig : 4
  await renderIP(version)

  if (currentIP) {
    renderIPLocationData(currentIP)
  }

})
