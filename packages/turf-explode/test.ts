import fs from "fs";
import path from "path";
import tape from "tape";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { explode } from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

tape("explode - fixtures", (t) => {
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
