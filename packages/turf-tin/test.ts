import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { tin } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const points = loadJsonFileSync(path.join(__dirname, "test", "Points.json"));

test("tin - z property", (t) => {
  const expected = loadJsonFileSync(path.join(__dirname, "test", "Tin.json"));
  const tinned = tin(points, "elevation");
  t.equal(tinned.features[0].geometry.type, "Polygon");
  t.equal(tinned.features.length, 24);
  t.deepEqual(tinned, expected, "tinned polygons match");
  if (process.env.REGEN) {
    fs.writeFileSync(
      path.join(__dirname, "test", "Tin.json"),
      JSON.stringify(tinned, null, 2)
    );
  }
  t.end();
});

test("tin - z coordinate", (t) => {
  const expected = loadJsonFileSync(path.join(__dirname, "test", "Tin-z.json"));
  const tinned = tin(points);
  t.equal(tinned.features[0].geometry.type, "Polygon");
  t.equal(tinned.features.length, 24);
  t.deepEqual(tinned, expected, "tinned polygons match");
  if (process.env.REGEN) {
    fs.writeFileSync(
      path.join(__dirname, "test", "Tin-z.json"),
      JSON.stringify(tinned, null, 2)
    );
  }
  t.end();
});
