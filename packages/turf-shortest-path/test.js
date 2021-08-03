import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import truncate from "@turf/truncate";
import { featureCollection, point } from "@turf/helpers";
import { getCoord } from "@turf/invariant";
import { featureEach } from "@turf/meta";
import shortestPath from "./index";

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: load.sync(directories.in + filename),
  };
});

test("turf-shortest-path", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    // First two features from Collection are Start & End Points
    const start = geojson.features.shift();
    const end = geojson.features.shift();
    // Any remaining features from Collection are obstacles
    const obstacles = geojson;
    const options = geojson.properties;
    options.obstacles = obstacles;

    const path = truncate(shortestPath(start, end, options));
    path.properties["stroke"] = "#F00";
    path.properties["stroke-width"] = 5;

    const results = featureCollection([]);
    if (obstacles) {
      featureEach(obstacles, (obstacle) => {
        results.features.push(obstacle);
      });
    }
    results.features.push(point(getCoord(start), start.properties));
    results.features.push(point(getCoord(end), end.properties));
    results.features.push(path);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEqual(results, load.sync(directories.out + filename), name);
  }
  t.end();
});
