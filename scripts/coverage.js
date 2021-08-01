#!/usr/bin/env node

const path = require("path");
const glob = require("glob");
const { spawnSync } = require("child_process");

glob.sync(path.join(__dirname, "..", "packages", "turf-*")).forEach((dir) => {
  const package = path.basename(dir);

  const log = spawnSync("npm", ["run", "coverage"], {
    encoding: "utf8",
    cwd: dir,
  });
  if (log.status === 1) {
    console.log("Turf package " + package + " has no coverage command");
  } else {
    console.log(log.stdout.trim());
  }
});
