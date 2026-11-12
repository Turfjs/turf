#!/usr/bin/env node

import path from "path";
import { readdir, readFile, writeFile } from "fs/promises";
import { parse as yamlParse } from "yaml";
import * as documentation from "documentation";
import { existsSync } from "fs";
import { execFileSync } from "node:child_process";

// In the pre-commit hook lint-staged does not automatically add derived files
// In lint-staged@17 it started warning against calling git add directly because of race conditions.
// These conditions do not apply when the file is generated, and so we call git add directly here to avoid a spurious warning.
const shouldGitAdd = process.argv.includes("--git-add");
const updated: string[] = [];

// In CI we want to regenerate all docs files to check for staleness
const shouldWriteAll = process.argv.includes("--write-all");

// Template for README Markdown
const postfix = await readFile(
  path.join(process.cwd(), "scripts/postfix.md"),
  "utf8"
);

const paths = yamlParse(
  await readFile(path.join(process.cwd(), "documentation.yml"), "utf8")
).paths;

const packagesPath = path.join(process.cwd(), "packages");
for (const dir of await readdir(packagesPath)) {
  if (dir === "turf") {
    continue;
  }

  const packagePath = path.join(packagesPath, dir, "package.json");
  const directory = path.parse(packagePath).dir;
  let indexPath = path.join(directory, "index.ts");
  const pckg = JSON.parse(await readFile(packagePath, "utf-8"));
  const name = pckg.name;

  const diagramsPath = path.join(directory, "diagrams");
  const images = existsSync(diagramsPath)
    ? (await readdir(diagramsPath)).filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(path.extname(file))
      )
    : [];

  // Build Documentation
  let res = await documentation.build(indexPath, {
    shallow: true,
    external: [],
  });

  if (res === undefined) {
    console.warn(`Failed to build docs for ${packagePath}`);
    continue;
  }

  // Workaround to exclude @deprecated tags from docs
  // See https://github.com/documentationjs/documentation/issues/1596
  res = res.filter((item: any) =>
    item.tags.every((tag: any) => tag.title !== "deprecated")
  );

  // Format Markdown
  let markdown = await documentation.formats.md(res, { paths });
  markdown = `# ${name}\n\n${markdown}${postfix.replace(/{module}/, name)}`;
  if (images.length) {
    markdown +=
      "\n\n### Diagrams\n\n" +
      images
        .map((img) => `![${path.parse(img).name}](diagrams/${img})`)
        .join("\n");
  }

  const readme = path.join(directory, "README.md");

  let existing = "";
  if (!shouldWriteAll) {
    // If we're already writing every docs file, we can skip reading the existing ones.
    // The existing value won't match the generated markdown and it will cause a write.
    try {
      existing = await readFile(readme, "utf8");
    } catch {
      // any errors will just result in us writing the expected contents anyhow
    }
  }

  if (existing !== markdown) {
    console.log(`Writing ${readme}`);
    await writeFile(readme, markdown);
    updated.push(readme);
  }
}

if (shouldGitAdd) {
  execFileSync("git", ["add", "--", ...updated]);
}
