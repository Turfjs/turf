import fs from "fs";
import path from "path";
import { loadJsonFileSync } from "load-json-file";
import Benchmark from "benchmark";
import { union } from "./index";
import { featureCollection } from "@turf/helpers";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});

const suite = new Benchmark.Suite("turf-union");

for (const { name, geojson } of fixtures) {
  suite.add(name, () => {
    union(featureCollection(geojson.features));
  });
}

suite.on("cycle", (e) => console.log(String(e.target))).run();
