import { writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

const packagesDir = join(process.cwd(), "packages");
const packageJsonContent = {
  type: "commonjs",
};

// Get all directories in packages/
const directories = readdirSync(packagesDir).filter((item) => {
  const fullPath = join(packagesDir, item);
  return statSync(fullPath).isDirectory() && item.startsWith("turf");
});

let count = 0;

// Process each turf* directory
for (const dir of directories) {
  const distCjsDir = join(packagesDir, dir, "dist", "cjs");
  const packageJsonPath = join(distCjsDir, "package.json");

  // Create the directory if it doesn't exist
  mkdirSync(distCjsDir, { recursive: true });

  // Write the package.json file
  writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJsonContent, null, 2) + "\n"
  );

  console.log(`✓ Created package.json in packages/${dir}/dist/cjs/`);
  count++;
}

console.log(`\nTotal: ${count} package.json file(s) created`);
