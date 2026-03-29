import { defineConfig, type Plugin } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import fs from 'fs/promises'
import path from 'path'

interface LocaleMessages {
  rateUsMessage?: {
    message: string
  }
  [key: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getManifestForTarget(targetBrowser: string): any {
  const browserManifest = structuredClone(manifest) as Record<string, any>

  if (targetBrowser === 'firefox') {
    const serviceWorkerEntry = browserManifest.background?.service_worker

    if (serviceWorkerEntry) {
      browserManifest.background = {
        scripts: [serviceWorkerEntry],
        type: 'module',
      }
    }

    browserManifest.browser_specific_settings = {
      gecko: {
        id: 'easy-ip-finder@abisaidev',
        strict_min_version: '109.0',
      },
    }

    // Firefox doesn't accept object format for author field
    delete browserManifest.author
  }

  return browserManifest
}

// Plugin to update locale files for Firefox target
function localesTransformPlugin(): Plugin {
  return {
    name: 'locales-transform',
    async writeBundle(): Promise<void> {
      const targetBrowser: string = process.env.TARGET_BROWSER || 'chrome'
      
      if (targetBrowser !== 'firefox') {
        return
      }

      // Update rateUsMessage for Firefox (remove Chrome Web Store link)
      const localesDir = path.join(process.cwd(), 'dist/firefox/_locales')
      const locales = await fs.readdir(localesDir)

      for (const locale of locales) {
        const messagesPath: string = path.join(localesDir, locale, 'messages.json')
        const content: string = await fs.readFile(messagesPath, 'utf-8')
        const messages: LocaleMessages = JSON.parse(content)

        if (messages.rateUsMessage) {
          // Replace Chrome Web Store link with Firefox-friendly text
          messages.rateUsMessage.message = messages.rateUsMessage.message.replace(
            /<a\s+href=['"]https:\/\/chromewebstore\.google\.com[^'"]*['"][^>]*>([^<]*)<\/a>/g,
            'leave a comment'
          )
        }

        await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2) + '\n')
      }
    },
  }
}

export default defineConfig(() => {
  const targetBrowser: string = process.env.TARGET_BROWSER || 'chrome'

  return {
    plugins: [crx({ manifest: getManifestForTarget(targetBrowser) }), localesTransformPlugin()],
    build: {
      outDir: `dist/${targetBrowser}`,
      emptyOutDir: false,
    },
  }
})