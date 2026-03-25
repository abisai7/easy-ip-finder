import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fsPromises } from 'node:fs'
import archiver from 'archiver'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')

const packageJsonPath = path.join(projectRoot, 'package.json')
const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, 'utf8'))

const sourceDir = path.join(projectRoot, 'dist', 'firefox')
const releasesDir = path.join(projectRoot, 'dist', 'releases')
const xpiFileName = `${packageJson.name}-firefox-v${packageJson.version}.xpi`
const xpiFilePath = path.join(releasesDir, xpiFileName)

const sourceExists = await fsPromises
  .access(sourceDir)
  .then(() => true)
  .catch(() => false)

if (!sourceExists) {
  throw new Error('dist/firefox was not found. Run "pnpm run build:firefox" first.')
}

await fsPromises.mkdir(releasesDir, { recursive: true })
await fsPromises.rm(xpiFilePath, { force: true })

await new Promise((resolve, reject) => {
  const output = fs.createWriteStream(xpiFilePath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  output.on('close', resolve)
  output.on('error', reject)
  archive.on('error', reject)

  archive.pipe(output)
  archive.directory(sourceDir, false)
  archive.finalize()
})

const relativeOutputPath = path.relative(projectRoot, xpiFilePath).replaceAll('\\', '/')
console.log(`Firefox package created: ${relativeOutputPath}`)
