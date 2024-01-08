import fs from "fs";
import path from "path";
import tape from "tape";
import { all as fixtures } from "geojson-fixtures";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { explode } from "./index.js";

const directories = {
  in: path.join("test", "in") + path.sep,
  out: path.join("test", "out") + path.sep,
};

// Save input fixtures
if (process.env.REGEN) {
  Object.keys(fixtures).forEach((name) => {
    writeJsonFileSync(directories.in + name + ".json", fixtures[name]);
  });
}

tape("explode - geojson-fixtures", (t) => {
  fs.readdirSync(directories.in).forEach((filename) => {
    const name = filename.replace(".json", "");
    const features = loadJsonFileSync(directories.in + filename);
    const exploded = explode(features);
    if (process.env.REGEN) {
      writeJsonFileSync(directories.out + filename, exploded);
    }
    t.deepEqual(exploded, loadJsonFileSync(directories.out + filename), name);
  });
  t.end();
});

tape("explode - preserve properties", (t) => {
  const filename = "polygon-with-properties.json";
  const features = loadJsonFileSync(directories.in + filename);
  const exploded = explode(features);
  if (process.env.REGEN) {
    writeJsonFileSync(directories.out + filename, exploded);
  }
  t.deepEqual(
    exploded,
    loadJsonFileSync(directories.out + filename),
    "properties"
  );
  t.end();
});
