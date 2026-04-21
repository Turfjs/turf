#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { execSync } from "node:child_process";

// Get the new version from the command line arguments
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Error: Please provide a version number as an argument.");
  console.error("Usage: pnpm run version 7.0.0");
  process.exit(1);
}

// Resolve the root directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const packagesDir = join(__dirname, "..", "packages");

async function updatePackageVersions(version: string) {
  try {
    // List all items in the packages directory
    const entries = await readdir(packagesDir, { withFileTypes: true });

    const packageDirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const pkg of packageDirs) {
      const packageJsonPath = join(packagesDir, pkg, "package.json");

      try {
        // Read and parse package.json
        const content = await readFile(packageJsonPath, "utf-8");
        const pkgData = JSON.parse(content);

        // Update version
        const oldVersion = pkgData.version;
        pkgData.version = version;

        // Write back to disk with 2-space indentation and a trailing newline
        await writeFile(
          packageJsonPath,
          JSON.stringify(pkgData, null, 2) + "\n",
          "utf-8"
        );

        console.log(`✅ Updated ${pkg}: ${oldVersion} -> ${version}`);
      } catch {
        console.warn(
          `⚠️ Skipping ${pkg}: No package.json found or invalid JSON.`
        );
      }
    }

    console.log("\nAll packages updated successfully.");

    console.log("\nGit commit and tag:");
    execSync("git add packages/*/package.json");
    execSync(`git commit -m "v${version}"`);
    execSync(`git tag -a "v${version}" -m "v${version}"`);
    console.log("\nGit operations completed successfully");
  } catch (error) {
    console.error("Failed to read packages directory:", error);
    process.exit(1);
  }
}

updatePackageVersions(newVersion);
