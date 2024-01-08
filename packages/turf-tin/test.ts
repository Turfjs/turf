import fs from "fs";
import path from "path";
import test from "tape";
import { loadJsonFileSync } from "load-json-file";
import { tin } from "./index.js";

const points = loadJsonFileSync(path.join("test", "Points.json"));

test("tin - z property", (t) => {
  const expected = loadJsonFileSync(path.join("test", "Tin.json"));
  const tinned = tin(points, "elevation");
  t.equal(tinned.features[0].geometry.type, "Polygon");
  t.equal(tinned.features.length, 24);
  t.deepEqual(tinned, expected, "tinned polygons match");
  if (process.env.REGEN) {
    fs.writeFileSync(
      path.join("test", "Tin.json"),
      JSON.stringify(tinned, null, 2)
    );
  }
  t.end();
});

test("tin - z coordinate", (t) => {
  const expected = loadJsonFileSync(path.join("test", "Tin-z.json"));
  const tinned = tin(points);
  t.equal(tinned.features[0].geometry.type, "Polygon");
  t.equal(tinned.features.length, 24);
  t.deepEqual(tinned, expected, "tinned polygons match");
  if (process.env.REGEN) {
    fs.writeFileSync(
      path.join("test", "Tin-z.json"),
      JSON.stringify(tinned, null, 2)
    );
  }
  t.end();
});
