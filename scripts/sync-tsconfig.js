#!/usr/bin/env node

const path = require("path");
const glob = require("glob");
const fs = require("fs");

const expectedTsConfig = JSON.stringify(
  {
    extends: "../../tsconfig.shared.json",
    files: ["index.js", "index.ts", "lib/"],
  },
  null,
  2
);

glob.sync("packages/turf-*").forEach((package) => {
  const tsconfigJsonPath = path.join(package, "tsconfig.json");
  fs.writeFileSync(tsconfigJsonPath, expectedTsConfig);
});
