import fs from "fs";
import test from "tape";
import path from "path";
import load from "load-json-file";
import write from "write-json-file";
import center from "@turf/center";
import hexGrid from "@turf/hex-grid";
import truncate from "@turf/truncate";
import turfBBox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import centroid from "@turf/centroid";
import { featureEach } from "@turf/meta";
import { getCoord } from "@turf/invariant";
import {
  point,
  lineString,
  geometryCollection,
  featureCollection,
} from "@turf/helpers";
import scale from "./index";

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

test("scale", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    let { factor, origin, mutate } = geojson.properties || {};
    factor = factor || 2;

    const scaled = scale(geojson, factor, {
      origin: origin,
      mutate: mutate,
    });
    const result = featureCollection([]);
    featureEach(
      colorize(truncate(scaled, { precision: 6, coordinates: 3 })),
      (feature) => result.features.push(feature)
    );
    featureEach(geojson, (feature) => result.features.push(feature));
    featureEach(geojson, (feature) =>
      result.features.push(markedOrigin(feature, origin))
    );

    if (process.env.REGEN) write.sync(directories.out + filename, result);
    t.deepEqual(result, load.sync(directories.out + filename), name);
  }

  t.end();
});

test("scale -- throws", (t) => {
  const line = lineString([
    [10, 10],
    [12, 15],
  ]);

  t.throws(() => scale(null, 1.5), /geojson required/);
  t.throws(() => scale(line, null), /invalid factor/);
  t.throws(() => scale(line, 0), /invalid factor/);
  t.throws(() => scale(line, 1.5, { origin: "foobar" }), /invalid origin/);
  t.throws(() => scale(line, 1.5, { origin: 2 }), /invalid origin/);

  t.end();
});

test("scale -- additional params", (t) => {
  const line = lineString([
    [10, 10],
    [12, 15],
  ]);
  const bbox = [-180, -90, 180, 90];

  t.assert(scale(line, 1.5, { origin: "sw" }));
  t.assert(scale(line, 1.5, { origin: "se" }));
  t.assert(scale(line, 1.5, { origin: "nw" }));
  t.assert(scale(line, 1.5, { origin: "ne" }));
  t.assert(scale(line, 1.5, { origin: "center" }));
  t.assert(scale(line, 1.5, { origin: "centroid" }));
  t.assert(scale(line, 1.5, { origin: null }));
  line.bbox = bbox;
  t.assert(scale(line, 1.5));
  t.end();
});

test("scale -- bbox provided", (t) => {
  const line = lineString([
    [10, 10],
    [12, 15],
  ]);
  line.bbox = [-180, -90, 180, 90];

  t.assert(scale(line, 1.5));
  t.end();
});

test("scale -- mutated input", (t) => {
  const line = lineString([
    [10, 10],
    [12, 15],
  ]);
  const lineBefore = JSON.parse(JSON.stringify(line));

  scale(line, 1.5);
  t.deepEqual(
    line,
    lineBefore,
    "mutate = undefined - input should NOT be mutated"
  );
  scale(line, 1.5, { origin: "centroid", mutate: false });
  t.deepEqual(line, lineBefore, "mutate = false - input should NOT be mutated");
  scale(line, 1.5, { orgin: "centroid", muate: "nonBoolean" });
  t.deepEqual(
    line,
    lineBefore,
    "non-boolean mutate - input should NOT be mutated"
  );

  scale(line, 1.5, { origin: "centroid", mutate: true });
  t.deepEqual(
    truncate(line, { precision: 1 }),
    lineString([
      [9.5, 8.8],
      [12.5, 16.2],
    ]),
    "mutate = true - input should be mutated"
  );
  t.end();
});

test("scale -- mutated FeatureCollection", (t) => {
  const line = featureCollection([
    lineString([
      [10, 10],
      [12, 15],
    ]),
    lineString([
      [15, 15],
      [22, 35],
    ]),
    lineString([
      [30, 30],
      [42, 45],
    ]),
  ]);
  const lineBefore = JSON.parse(JSON.stringify(line));
  scale(line, 1.5);
  t.deepEqual(
    line,
    lineBefore,
    "mutate = undefined - input should NOT be mutated"
  );
  scale(line, 1.5, { origin: "centroid", mutate: false });
  t.deepEqual(line, lineBefore, "mutate = false - input should NOT be mutated");
  scale(line, 1.5, { origin: "centroid", mutate: "nonBoolean" });
  t.deepEqual(
    line,
    lineBefore,
    "non-boolean mutate - input should NOT be mutated"
  );
  t.end();
});

test("scale -- Issue #895", (t) => {
  const bbox = [-122.93, 45.385, -122.294, 45.772];
  const grid = hexGrid(bbox, 2, { units: "miles" });
  featureEach(grid, (feature, index) => {
    const factor = index % 2 === 0 ? 0.4 : 0.6;
    scale(feature, factor, { origin: "centroid", mutate: true });
  });
  // Add styled GeoJSON to the result
  const poly = bboxPolygon(bbox);
  poly.properties = {
    stroke: "#F00",
    "stroke-width": 6,
    "fill-opacity": 0,
  };
  grid.features.push(poly);
  const output = directories.out + "issue-#895.geojson";
  if (process.env.REGEN) write.sync(output, grid);
  t.deepEqual(grid, load.sync(output));
  t.end();
});

test("scale -- geometry support", (t) => {
  const pt = point([10, 10]);
  const line = lineString([
    [10, 10],
    [12, 15],
  ]);

  t.assert(
    scale(geometryCollection([line.geometry]), 1.5),
    "geometryCollection support"
  );
  t.assert(
    scale(geometryCollection([line.geometry]).geometry, 1.5),
    "geometryCollection support"
  );
  t.assert(scale(featureCollection([line]), 1.5), "featureCollection support");
  t.assert(scale(line.geometry, 1.5), "geometry line support");
  t.assert(scale(pt.geometry, 1.5), "geometry point support");
  t.assert(scale(pt, 1.5), "geometry point support");
  t.assert(scale(pt, 1.5, { origin: pt }), "feature point support");
  t.assert(scale(pt, 1.5, { origin: pt.geometry }), "geometry point support");
  t.assert(
    scale(pt, 1.5, { origin: pt.geometry.coordinates }),
    "coordinate point support"
  );

  t.end();
});

test("scale -- factor 0 or less throws error", (t) => {
  const pt = point([10, 10]);
  t.throws(() => {
    scale(pt, 0);
  }, "should throw for zero");

  t.throws(() => {
    scale(pt, -1);
  }, "should throw for negative");

  t.end();
});

// style result
function colorize(geojson) {
  featureEach(geojson, (feature, index) => {
    if (
      feature.geometry.type === "Point" ||
      feature.geometry.type === "MultiPoint"
    ) {
      feature.properties["marker-color"] = "#F00";
      feature.properties["marker-symbol"] = "star";
    } else {
      feature.properties["stroke"] = "#F00";
      feature.properties["stroke-width"] = 4;
    }
    if (geojson.type === "Feature") return feature;
    geojson.features[index] = feature;
  });
  return geojson;
}

// define origin, as defined in transform-scale, and style it
function markedOrigin(
  geojson,
  origin,
  properties = { "marker-color": "#00F", "marker-symbol": "circle" }
) {
  // Input Geometry|Feature<Point>|Array<number>
  if (Array.isArray(origin) || typeof origin === "object")
    return point(getCoord(origin), properties);

  // Define BBox
  const [west, south, east, north] = geojson.bbox
    ? geojson.bbox
    : turfBBox(geojson);

  switch (origin) {
    case "sw":
    case "southwest":
    case "westsouth":
    case "bottomleft":
      return point([west, south], properties);
    case "se":
    case "southeast":
    case "eastsouth":
    case "bottomright":
      return point([east, south], properties);
    case "nw":
    case "northwest":
    case "westnorth":
    case "topleft":
      return point([west, north], properties);
    case "ne":
    case "northeast":
    case "eastnorth":
    case "topright":
      return point([east, north], properties);
    case "center":
      var cr = center(geojson);
      cr.properties = properties;
      return cr;
    default:
      var cid = centroid(geojson);
      cid.properties = properties;
      return cid;
  }
}
