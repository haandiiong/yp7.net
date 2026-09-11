import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'

const configDir = fileURLToPath(new URL('../../docs/.vuepress/config/', import.meta.url))
const modules = new Map()

// Scripts and tests load the same TypeScript config graph as the VuePress build.
export const loadConfig = (file) => {
  const path = resolve(configDir, file)
  if (modules.has(path)) return modules.get(path).exports

  const module = { exports: {} }
  modules.set(path, module)
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  const require = createRequire(path)
  const run = vm.runInThisContext(`(function(require, exports, module) {\n${outputText}\n})`, { filename: path })
  run((specifier) => specifier.startsWith('.')
    ? loadConfig(resolve(dirname(path), `${specifier}.ts`))
    : require(specifier), module.exports, module)
  return module.exports
}
