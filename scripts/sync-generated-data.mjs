import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const publicDataDir = 'docs/.vuepress/public/data'
const generatedDataDir = 'docs/.vuepress/dist/data'
const publicLlmsPath = 'docs/.vuepress/public/llms.txt'
const generatedLlmsPath = 'docs/.vuepress/dist/llms.txt'

if (!existsSync(generatedDataDir)) {
  console.error(`Missing ${generatedDataDir}. Run pnpm run docs:build first.`)
  process.exit(1)
}

if (!existsSync(generatedLlmsPath)) {
  console.error(`Missing ${generatedLlmsPath}. Run pnpm run docs:build first.`)
  process.exit(1)
}

mkdirSync(publicDataDir, { recursive: true })

const files = readdirSync(generatedDataDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort()

files.forEach((file) => {
  copyFileSync(join(generatedDataDir, file), join(publicDataDir, file))
})

copyFileSync(generatedLlmsPath, publicLlmsPath)

console.log(`Synced ${files.length} generated data files and llms.txt.`)
