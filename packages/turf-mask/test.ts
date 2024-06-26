import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { mask } from "./index.js";
import { clone } from "../turf-clone/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKIP = ["multi-polygon.geojson", "overlapping.geojson"];

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(path.join(directories.in, filename)),
  };
});

test("turf-mask", (t) => {
  for (const { name, filename, geojson } of fixtures) {
    if (-1 !== SKIP.indexOf(filename)) {
      continue;
    }

    const [polygon, masking] = geojson.features;
    const results = mask(polygon, masking);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, results);
    t.deepEquals(results, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

const getBasicPolygonAndMask = () => {
  const basicFixture = fixtures.find(
    ({ filename }) => filename === "basic.geojson"
  );
  if (!basicFixture) throw new Error("basic.geojson not found");
  return basicFixture.geojson.features;
};

test("turf-mask -- doesn't mutate inputs by default", (t) => {
  const [polygon, masking] = getBasicPolygonAndMask();
  const maskClone = clone(masking);

  mask(polygon, masking);

  t.deepEquals(masking, maskClone, "mask input should not be mutated");

  t.end();
});

test("turf-mask -- mutates mask input when mutate = true", (t) => {
  const [polygon, masking] = getBasicPolygonAndMask();
  const maskClone = clone(masking);

  mask(polygon, masking, { mutate: true });

  t.notDeepEqual(masking, maskClone, "mask input should be mutated");

  t.end();
});
