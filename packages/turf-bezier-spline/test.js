const fs = require("fs");
const test = require("tape");
const path = require("path");
const load = require("load-json-file");
const write = require("write-json-file");
const { featureCollection } = require("@turf/helpers");
const bezierSpline = require("./index").default;

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

test("turf-bezier-spline", (t) => {
  fixtures.forEach((fixture) => {
    const filename = fixture.filename;
    const name = fixture.name;
    const geojson = fixture.geojson;
    const spline = colorize(bezierSpline(geojson));
    const results = featureCollection([spline, geojson]);

    if (process.env.REGEN) write.sync(directories.out + filename, results);
    t.deepEquals(results, load.sync(directories.out + filename), name);
  });
  t.end();
});

function colorize(feature, color, width) {
  color = color || "#F00";
  width = width || 6;
  feature.properties = {
    stroke: color,
    fill: color,
    "stroke-width": width,
    "fill-opacity": 0.1,
  };
  return feature;
}
