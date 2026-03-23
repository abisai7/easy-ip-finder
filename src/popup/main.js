import './style.css'
import { ipTracker } from '../services/ip/tracker'
import { ipLocation } from '../services/ip/location'
import { popupStorage } from './storage'
import { createPopupUI } from './ui'
import { createPopupController } from './controller'
import { renderPopupTemplate } from './template'
import { getPopupElements } from './elements'
import { getPopupMessages } from './messages'

const messages = getPopupMessages()

document.querySelector('#app').innerHTML = renderPopupTemplate({
  title: messages.title,
  copyToClipboardAction: messages.copyToClipboardAction,
  copyConfigText: messages.copyConfigText,
  rateUsMessage: messages.rateUsMessage,
  authorMessage: messages.authorMessage,
})

const elements = getPopupElements()

const currentLang = chrome.i18n.getUILanguage().slice(0, 2)
const regionNames = new Intl.DisplayNames([currentLang], {
  type: 'region',
})

const ui = createPopupUI(
  elements,
  {
    changeVersionToShowText: messages.changeVersionToShowText,
    yourCurrentCountryMessage: messages.yourCurrentCountryMessage,
    ispMessage: messages.ispMessage,
  },
  regionNames,
)

const showNotification = () => {
  const options = {
    type: 'basic',
    title: messages.title,
    message: messages.ipCopiedText,
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
  genericErrorMessage: messages.genericErrorMessage,
  onCopyNotification: showNotification,
})

controller.bindEvents()

document.addEventListener('DOMContentLoaded', async () => {
  await controller.init()
})
