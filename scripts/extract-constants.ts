#!/usr/bin/env node

import fs from "fs-extra";
import { ast, query } from "@phenomnomnominal/tsquery";

(async () => {
  try {
    const helpersTs = fs
      .readFileSync("packages/turf-helpers/index.ts", "utf8")
      .toString();
    const theAst = ast(helpersTs);
    const tNodes = query(theAst, "TypeAliasDeclaration");
    console.log(tNodes.length); // 7
  } catch (e) {
    console.warn(e);
  }
})();
