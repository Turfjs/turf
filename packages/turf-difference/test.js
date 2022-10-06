const path = require("path");
const test = require("tape");
const glob = require("glob");
const load = require("load-json-file");
const write = require("write-json-file");
const { featureCollection, polygon } = require("@turf/helpers");
const difference = require("./index").default;

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

test("turf-difference", (t) => {
  glob.sync(directories.in + "*.geojson").forEach((filepath) => {
    const { name, base } = path.parse(filepath);
    const [polygon1, polygon2] = load.sync(filepath).features;

    if (name.includes("skip")) return t.skip(name);

    // Red Polygon1
    polygon1.properties = Object.assign(polygon1.properties || {}, {
      "fill-opacity": 0.5,
      fill: "#F00",
    });
    // Blue Polygon2
    polygon2.properties = Object.assign(polygon2.properties || {}, {
      "fill-opacity": 0.5,
      fill: "#00F",
    });

    const results = featureCollection([polygon1, polygon2]);

    const result = difference(results);
    if (result) {
      // Green Polygon
      result.properties = { "fill-opacity": 1, fill: "#0F0" };
      results.features.push(result);
    }

    if (process.env.REGEN) write.sync(directories.out + base, results);
    t.deepEqual(results, load.sync(directories.out + base), name);
  });
  t.end();
});

test("turf-difference - support specific polygons", (t) => {
  const poly1 = polygon([
    [
      [121, -31],
      [144, -31],
      [144, -15],
      [121, -15],
      [121, -31],
    ],
  ]);
  const poly2 = polygon([
    [
      [126, -28],
      [140, -28],
      [140, -20],
      [126, -20],
      [126, -28],
    ],
  ]);

  t.assert(
    difference(featureCollection([poly1, poly2])),
    "geometry object support"
  );
  t.end();
});

test("turf-difference - prevent input mutation", (t) => {
  const poly1 = polygon([
    [
      [121, -31],
      [144, -31],
      [144, -15],
      [121, -15],
      [121, -31],
    ],
  ]);
  const poly2 = polygon([
    [
      [126, -28],
      [140, -28],
      [140, -20],
      [126, -20],
      [126, -28],
    ],
  ]);
  const before1 = JSON.parse(JSON.stringify(poly1));
  const before2 = JSON.parse(JSON.stringify(poly2));

  difference(featureCollection([poly1, poly2]));
  t.deepEqual(poly1, before1, "polygon1 should not mutate");
  t.deepEqual(poly2, before2, "polygon2 should not mutate");
  t.end();
});

test("turf-difference - complete overlap", (t) => {
  const poly = polygon([
    [
      [121, -31],
      [144, -31],
      [144, -15],
      [121, -15],
      [121, -31],
    ],
  ]);

  const result = difference(featureCollection([poly, poly]));
  t.deepEqual(result, null, "difference should be null");
  t.end();
});
