#!/usr/bin/env node

/**
 * Nexus Agent — Binary Build Script
 * Bundles CLI into a standalone executable using esbuild
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

console.log(`
╔══════════════════════════════════════╗
║    Nexus Agent — Binary Builder     ║
╚══════════════════════════════════════╝
`);

// Ensure dist exists
if (!existsSync(join(ROOT, 'dist'))) {
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
}

// Step 1: Bundle with esbuild
console.log('📦 Step 1/3: Bundling with esbuild...');

try {
  execSync(
    `npx esbuild src/cli.ts src/server.ts src/orchestrator.ts src/agent.ts src/types.ts src/providers/index.ts src/agents/defs.ts --bundle --platform=node --format=esm --outfile=dist/nexus-cli.mjs --allow-overwrite --minify --banner:js="/**\\n * Nexus Agent v1.0.0\\n * Built: ${new Date().toISOString()}\\n * Repository: https://github.com/Botan-linux/nexus-agent\\n */\\n#!/usr/bin/env node"`,
    { cwd: ROOT, stdio: 'pipe' }
  );
  console.log('   ✓ Bundle created: dist/nexus-cli.mjs');
} catch (e: any) {
  // Try individual bundling approach
  console.log('   ⚠ Multi-entry failed, trying single entry...');
  try {
    execSync(
      `npx esbuild src/cli.ts --bundle --platform=node --format=esm --outfile=dist/nexus-cli.mjs --allow-overwrite --banner:js="/** Nexus Agent v1.0.0 */#!/usr/bin/env node"`,
      { cwd: ROOT, stdio: 'pipe' }
    );
    console.log('   ✓ Bundle created: dist/nexus-cli.mjs');
  } catch (e2: any) {
    console.error('   ❌ esbuild failed:', e2.message);
    process.exit(1);
  }
}

// Step 2: Create launcher script
console.log('🔧 Step 2/3: Creating launcher scripts...');

const launcherSh = `#!/bin/bash
# Nexus Agent Launcher
# Installed from: https://github.com/Botan-linux/nexus-agent
DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
NODE_OPTIONS="" node "\${DIR}/nexus-cli.mjs" "$@"
`;

const launcherCmd = `@echo off
REM Nexus Agent Launcher
REM Installed from: https://github.com/Botan-linux/nexus-agent
node "%~dp0nexus-cli.mjs" %*
`;

// Write launchers to dist
const fs = await import('fs');
fs.writeFileSync(join(ROOT, 'dist', 'nexus'), launcherSh);
fs.writeFileSync(join(ROOT, 'dist', 'nexus.cmd'), launcherCmd);
chmodSync(join(ROOT, 'dist', 'nexus'), 0o755);
console.log('   ✓ Launcher: dist/nexus');
console.log('   ✓ Launcher: dist/nexus.cmd');

// Step 3: Copy necessary files
console.log('📋 Step 3/3: Copying assets...');

if (existsSync(join(ROOT, 'README.md'))) {
  copyFileSync(join(ROOT, 'README.md'), join(ROOT, 'dist', 'README.md'));
}
if (existsSync(join(ROOT, 'install.sh'))) {
  copyFileSync(join(ROOT, 'install.sh'), join(ROOT, 'dist', 'install.sh'));
  chmodSync(join(ROOT, 'dist', 'install.sh'), 0o755);
}

console.log(`
╔══════════════════════════════════════╗
║       Build Complete! ✅              ║
╠══════════════════════════════════════╣
║                                      ║
║  Output: dist/                       ║
║  ├── nexus-cli.mjs   (bundle)        ║
║  ├── nexus           (launcher)      ║
║  ├── nexus.cmd       (launcher)      ║
║  └── install.sh                      ║
║                                      ║
║  Install locally:                    ║
║    sudo ./dist/install.sh            ║
║                                      ║
║  Or copy to PATH:                    ║
║    cp dist/nexus /usr/local/bin/     ║
║                                      ║
╚══════════════════════════════════════╝
`);
