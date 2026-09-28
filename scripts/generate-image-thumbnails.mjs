// Optional maintenance command on macOS: node scripts/generate-image-thumbnails.mjs
// Thumbnails are checked in; production builds do not require sips. Originals
// remain the evidence files and are linked from every thumbnail in the article.
import { execFileSync } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const publicDir = fileURLToPath(new URL('../docs/.vuepress/public/', import.meta.url))
const outputDir = join(publicDir, 'thumbnails')
const images = [
  ...Array.from({ length: 6 }, (_, index) => [`quanqiuyun${index + 1}`, 100]),
  ['youtubecesu', 300],
  ['speedtest', 300],
]

if (process.platform !== 'darwin') {
  throw new Error('Thumbnail regeneration uses macOS sips. Existing thumbnails work on every build platform.')
}
mkdirSync(outputDir, { recursive: true })
let originalBytes = 0
const generatedBytes = [0, 0]
for (const [name, displayWidth] of images) {
  const source = join(publicDir, `${name}.png`)
  originalBytes += statSync(source).size
  for (const density of [1, 2]) {
    // The original Speedtest PNG is already smaller than a resampled 600px PNG.
    // Its article srcset reuses that 750px original for high-density screens.
    if (name === 'speedtest' && density === 2) {
      generatedBytes[1] += statSync(source).size
      continue
    }
    const width = displayWidth * density
    const output = join(outputDir, `${name}-${width}.png`)
    execFileSync('sips', ['--resampleWidth', String(width), source, '--out', output], { stdio: 'ignore' })
    generatedBytes[density - 1] += statSync(output).size
  }
}
console.log(JSON.stringify({ imageCount: images.length, originalBytes, thumbnail1xBytes: generatedBytes[0], thumbnail2xBytes: generatedBytes[1] }, null, 2))
