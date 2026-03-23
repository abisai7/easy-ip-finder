import './style.css'
import { ipTracker } from '../iptracker/iptracker'
import { ipLocation } from '../iplocation/iplocation'
import { popupStorage } from './storage'
import { createPopupUI } from './ui'
import { createPopupController } from './controller'
import { renderPopupTemplate } from './template'

const title = chrome.i18n.getMessage('extName')
const copyToClipboardAction = chrome.i18n.getMessage('copyToClipboardAction')
const copyConfigText = chrome.i18n.getMessage('copyConfigText')
const genericErrorMessage = chrome.i18n.getMessage('genericErrorMessage')
const changeVersionToShowText = chrome.i18n.getMessage(
  'changeVersionToShowText',
)
const yourCurrentCountryMessage = chrome.i18n.getMessage(
  'yourCurrentCountryMessage',
)
const ispMessage = chrome.i18n.getMessage('ispMessage')
const rateUsMessage = chrome.i18n.getMessage('rateUsMessage')
const authorMessage = chrome.i18n.getMessage('authorMessage')
document.querySelector('#app').innerHTML = renderPopupTemplate({
  title,
  copyToClipboardAction,
  copyConfigText,
  rateUsMessage,
  authorMessage,
})

const elements = {
  clipboardConfigCheck: document.querySelector('#clipboard-config-check'),
  changeVersionButton: document.querySelector('.change-version-btn'),
  changeVersionButtonText: document.querySelector('.change-version-btn-text'),
  copyToClipboardButton: document.querySelector('.copy-to-clipboard-btn'),
  loader: document.querySelector('.lds-loading'),
  error: document.querySelector('.error'),
  ip: document.querySelector('x-ip'),
  moreIpInfo: document.querySelector('.more-ip-info'),
}

const currentLang = chrome.i18n.getUILanguage().slice(0, 2)
const regionNames = new Intl.DisplayNames([currentLang], {
  type: 'region',
})

const ui = createPopupUI(
  elements,
  {
    changeVersionToShowText,
    yourCurrentCountryMessage,
    ispMessage,
  },
  regionNames,
)

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

const controller = createPopupController({
  elements,
  ui,
  popupStorage,
  ipTracker,
  ipLocation,
  genericErrorMessage,
  onCopyNotification: showNotification,
})

controller.bindEvents()

document.addEventListener('DOMContentLoaded', async () => {
  await controller.init()
})
