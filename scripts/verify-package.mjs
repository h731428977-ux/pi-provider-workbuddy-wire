import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'

const root = process.cwd()
const packagePath = resolve(root, 'package.json')
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
const failures = []

function fail(message) {
  failures.push(message)
}

function requireFile(relativePath) {
  const absolutePath = resolve(root, relativePath)
  const fromRoot = relative(root, absolutePath)
  if (fromRoot.startsWith('..') || isAbsolute(fromRoot)) {
    fail(`${relativePath} resolves outside the package root`)
    return
  }
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    fail(`missing required file: ${relativePath}`)
  }
}

if (pkg.name !== 'pi-provider-workbuddy-wire') fail(`unexpected package name: ${pkg.name}`)
if (typeof pkg.version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(pkg.version)) {
  fail(`invalid release version: ${pkg.version}`)
}
if (pkg.license !== 'MIT') fail('license must be MIT')
if (pkg.engines?.node !== '>=22.19.0') fail('Node engine must match the Pi runtime baseline')
if (pkg.publishConfig?.registry !== 'https://registry.npmjs.org/') {
  fail('publishConfig.registry must target npmjs.org')
}
if (pkg.publishConfig?.access !== 'public') fail('publishConfig.access must be public')
if (pkg.main !== './dist/index.js') fail('main must point to dist/index.js')
if (pkg.exports?.['.'] !== './dist/index.js') fail('exports["."] must point to dist/index.js')

const extensions = pkg.pi?.extensions
if (!Array.isArray(extensions) || extensions.length === 0) {
  fail('pi.extensions must contain at least one extension')
} else {
  for (const extension of extensions) {
    if (typeof extension !== 'string' || extension.trim() === '') {
      fail('pi.extensions contains a non-string or empty entry')
      continue
    }
    if (extension.endsWith('.ts')) fail(`published entry must not be TypeScript: ${extension}`)
    requireFile(extension)
  }
}

for (const required of [
  'LICENSE',
  'README.md',
  'CHANGELOG.md',
  'src/index.ts',
  'dist/index.js',
]) {
  requireFile(required)
}

const lock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'))
if (lock.name !== pkg.name) fail('package-lock name does not match package.json')
if (lock.version !== pkg.version || lock.packages?.['']?.version !== pkg.version) {
  fail('package-lock version does not match package.json')
}

const changelog = readFileSync(resolve(root, 'CHANGELOG.md'), 'utf8')
if (!changelog.includes(`## [${pkg.version}]`)) {
  fail(`CHANGELOG.md has no section for ${pkg.version}`)
}

const built = readFileSync(resolve(root, 'dist/index.js'))
if (built.length < 10_000) fail('dist/index.js looks unexpectedly small')
for (const marker of ['workbuddy-api', 'workbuddy-anthropic', 'X-Conversation-ID']) {
  if (!built.includes(Buffer.from(marker, 'utf8'))) {
    fail(`dist/index.js is missing build marker: ${marker}`)
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`ERROR: ${failure}`)
  process.exit(1)
}

const digest = createHash('sha256').update(built).digest('hex')
console.log(`Package check OK: ${pkg.name}@${pkg.version}`)
console.log(`dist/index.js sha256: ${digest}`)
