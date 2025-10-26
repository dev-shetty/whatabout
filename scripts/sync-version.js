#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "..")

const packageJson = JSON.parse(
  readFileSync(join(rootDir, "package.json"), "utf8")
)
const manifestJson = JSON.parse(
  readFileSync(join(rootDir, "manifest.json"), "utf8")
)

if (packageJson.version !== manifestJson.version) {
  manifestJson.version = packageJson.version
  writeFileSync(
    join(rootDir, "manifest.json"),
    JSON.stringify(manifestJson, null, 2) + "\n"
  )
  console.log(`✓ Synced version to ${packageJson.version}`)
} else {
  console.log(`✓ Versions already in sync (${packageJson.version})`)
}
