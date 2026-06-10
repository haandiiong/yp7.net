import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const publicDataDir = 'docs/.vuepress/public/data'
const generatedDataDir = 'docs/.vuepress/dist/data'
const publicLlmsPath = 'docs/.vuepress/public/llms.txt'
const generatedLlmsPath = 'docs/.vuepress/dist/llms.txt'

const fail = (message) => {
  console.error(message)
  process.exit(1)
}

if (!existsSync(publicDataDir)) fail(`Missing ${publicDataDir}`)
if (!existsSync(generatedDataDir)) fail(`Missing ${generatedDataDir}. Run pnpm run docs:build first.`)
if (!existsSync(publicLlmsPath)) fail(`Missing ${publicLlmsPath}`)
if (!existsSync(generatedLlmsPath)) fail(`Missing ${generatedLlmsPath}. Run pnpm run docs:build first.`)

const getFiles = (dir) => readdirSync(dir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort()

const publicFiles = getFiles(publicDataDir)
const generatedFiles = getFiles(generatedDataDir)
const expected = new Set([...publicFiles, ...generatedFiles])
const mismatches = []

for (const file of expected) {
  const publicPath = join(publicDataDir, file)
  const generatedPath = join(generatedDataDir, file)

  if (!existsSync(publicPath)) {
    mismatches.push(`${file}: missing from ${publicDataDir}`)
    continue
  }

  if (!existsSync(generatedPath)) {
    mismatches.push(`${file}: missing from ${generatedDataDir}`)
    continue
  }

  if (readFileSync(publicPath, 'utf8') !== readFileSync(generatedPath, 'utf8')) {
    mismatches.push(`${file}: content differs`)
  }
}

if (readFileSync(publicLlmsPath, 'utf8') !== readFileSync(generatedLlmsPath, 'utf8')) {
  mismatches.push('llms.txt: content differs')
}

if (mismatches.length) {
  console.error('Generated data is out of sync:')
  mismatches.forEach((item) => console.error(`- ${item}`))
  console.error('Run pnpm run docs:build, then pnpm run docs:sync-data.')
  process.exit(1)
}

console.log('Generated data is in sync.')
