#!/usr/bin/env node

import path from "path";
import { readdir, readFile, writeFile } from "fs/promises";
import { parse as yamlParse } from "yaml";
import * as documentation from "documentation";
import { existsSync } from "fs";

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
  let indexPath = path.join(directory, "index.js");
  const pckg = JSON.parse(await readFile(packagePath, "utf-8"));
  const name = pckg.name;

  const diagramsPath = path.join(directory, "diagrams");
  const images = existsSync(diagramsPath)
    ? (await readdir(diagramsPath)).filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(path.extname(file))
      )
    : [];

  // some of the packages are typescript instead
  if (!existsSync(indexPath)) {
    indexPath = path.join(directory, "index.ts");
  }

  // Build Documentation
  let res = await documentation.build(indexPath, {
    shallow: true,
    external: [],
  });

  if (res === undefined) {
    console.warn(`Failed to build docs for ${packagePath}`);
    continue;
  }

  console.log("Building Docs: " + name);

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

  await writeFile(path.join(directory, "README.md"), markdown);
}
