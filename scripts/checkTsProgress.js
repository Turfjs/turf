#!/usr/bin/env node

const path = require("path");
const glob = require("glob");
const fs = require("fs");

let count = 1;

glob.sync(path.join(__dirname, "..", "packages", "turf-*")).forEach((pk) => {
  fs.stat(path.join(pk, "index.ts"), function (err) {
    if (err) {
      console.log(count + ". " + pk);
      count++;
    }
  });
});
