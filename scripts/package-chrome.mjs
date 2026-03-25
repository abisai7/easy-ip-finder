import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fsPromises } from 'node:fs'
import archiver from 'archiver'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')

const packageJsonPath = path.join(projectRoot, 'package.json')
const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, 'utf8'))

const sourceDir = path.join(projectRoot, 'dist', 'chrome')
const releasesDir = path.join(projectRoot, 'dist', 'releases')
const zipFileName = `${packageJson.name}-chrome-v${packageJson.version}.zip`
const zipFilePath = path.join(releasesDir, zipFileName)

const sourceExists = await fsPromises
  .access(sourceDir)
  .then(() => true)
  .catch(() => false)

if (!sourceExists) {
  throw new Error('dist/chrome was not found. Run "pnpm run build:chrome" first.')
}

await fsPromises.mkdir(releasesDir, { recursive: true })
await fsPromises.rm(zipFilePath, { force: true })

await new Promise((resolve, reject) => {
  const output = fs.createWriteStream(zipFilePath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', resolve)
  output.on('error', reject)
  archive.on('error', reject)

  archive.pipe(output)
  archive.directory(sourceDir, false)
  archive.finalize()
})

const relativeOutputPath = path.relative(projectRoot, zipFilePath).replaceAll('\\', '/')
console.log(`Chrome package created: ${relativeOutputPath}`)
