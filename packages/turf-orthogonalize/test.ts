import {
  Feature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from "geojson";
import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import {
  degreesToRadians,
  featureCollection,
  multiPolygon,
  point,
  polygon,
  radiansToDegrees,
} from "@turf/helpers";
import { toMercator } from "@turf/projection";
import { truncate } from "@turf/truncate";
import { orthogonalize } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
  unchanged: path.join(__dirname, "test", "unchanged") + path.sep,
};

const fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename) as Feature<
      Polygon | MultiPolygon
    >,
  };
});

const unchangedFixtures = fs
  .readdirSync(directories.unchanged)
  .map((filename) => ({
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(
      directories.unchanged + filename
    ) as Feature<Polygon>,
  }));

const nearSquare = polygon([
  [
    [0, 0],
    [0.001, 0.00005],
    [0.00095, 0.001],
    [-0.00005, 0.00095],
    [0, 0],
  ],
]);

const getAngles = (ring: Position[]) =>
  ring.slice(0, -1).map((position, i) => {
    const previous = ring[(i + ring.length - 2) % (ring.length - 1)];
    const [ax, ay] = [previous[0] - position[0], previous[1] - position[1]];
    const [bx, by] = [
      ring[i + 1][0] - position[0],
      ring[i + 1][1] - position[1],
    ];
    return radiansToDegrees(
      Math.atan2(Math.abs(ax * by - ay * bx), ax * bx + ay * by)
    );
  });

const getErrorDegrees = (before: number[], after: number[]) =>
  after.reduce(
    (sum, angle, i) =>
      Math.abs(before[i] - 90) < 15 ? sum + Math.abs(angle - 90) : sum,
    0
  );

const assertSquare = (t: test.Test, ring: Position[]) => {
  getAngles(ring).forEach((angle, i) => {
    t.ok(Math.abs(angle - 90) < 0.5, `corner ${i} is within 0.5° of square`);
  });
};

test("orthogonalize", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    const squared = orthogonalize(geojson, geojson.properties ?? {});
    squared.properties = { stroke: "#F00", "stroke-width": 4 };
    const result = featureCollection([
      truncate(squared, { precision: 7 }),
      geojson,
    ]);

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, result);
    t.deepEqual(result, loadJsonFileSync(directories.out + filename), name);
  }
  t.end();
});

test("orthogonalize -- squares corners on the ground", (t) => {
  const rectangle = fixtures.find(({ name }) => name === "rectangle")!.geojson;
  assertSquare(
    t,
    toMercator(orthogonalize(rectangle)).geometry.coordinates[0] as Position[]
  );
  t.end();
});

test("orthogonalize -- squares a ring running past the antimeridian", (t) => {
  const expected = orthogonalize(nearSquare).geometry.coordinates[0];
  for (const offset of [179.9995, -180.0005, 181]) {
    const translated = polygon([
      nearSquare.geometry.coordinates[0].map(([longitude, latitude]) => [
        longitude + offset,
        latitude,
      ]),
    ]);
    const actual = orthogonalize(translated).geometry.coordinates[0];
    actual.forEach(([longitude, latitude], i) => {
      t.ok(
        Math.abs(longitude - expected[i][0] - offset) < 1e-8 &&
          Math.abs(latitude - expected[i][1]) < 1e-8,
        `corner ${i} keeps its longitude range at ${offset}°`
      );
    });
  }
  t.end();
});

test("orthogonalize -- merges a very short edge wherever it is", (t) => {
  const [a, b, c, d] = nearSquare.geometry.coordinates[0];
  const toward = (x: number, y: number) => [
    b[0] + (4.5e-7 * x) / Math.hypot(x, y),
    b[1] + (4.5e-7 * y) / Math.hypot(x, y),
  ];
  const short = [-0.00000045, 0.00000045];
  const rings: Record<string, Position[]> = {
    "repeated vertex": [a, b, b, c, d, a],
    "along the previous wall": [a, b, toward(1, 0.05), c, d, a],
    "along the next wall": [a, b, toward(-0.05, 0.95), c, d, a],
    "at a diagonal": [a, b, toward(1, 1 / 3), c, d, a],
    "at a backward diagonal": [a, b, toward(-1, 1 / 3), c, d, a],
    "first edge": [a, short, b, c, d, a],
    "closing edge": [a, b, c, d, short, a],
  };
  for (const [name, ring] of Object.entries(rings)) {
    const { coordinates } = orthogonalize(polygon([ring])).geometry;
    t.equal(coordinates[0].length, 5, `merges the ${name}`);
    t.deepEqual(coordinates[0][0], coordinates[0][4], `${name} stays closed`);
    assertSquare(t, toMercator(polygon(coordinates)).geometry.coordinates[0]);
  }
  t.end();
});

test("orthogonalize -- does not fold a sharp spike flat", (t) => {
  const ring = toMercator(
    orthogonalize(
      polygon([
        [
          [0, 0],
          [0.001, 0],
          [0.001, 0.00055],
          [0.00055, 0.001],
          [0.0005, 0.003],
          [0.00045, 0.001],
          [0, 0.00055],
          [0, 0],
        ],
      ])
    )
  ).geometry.coordinates[0];
  t.ok(getAngles(ring)[4] > 0.57, "spike keeps its width");
  t.end();
});

test("orthogonalize -- leaves a ring unchanged if squaring would damage it", (t) => {
  for (const { name, geojson } of unchangedFixtures) {
    t.deepEqual(
      orthogonalize(geojson, geojson.properties ?? {}),
      geojson,
      name
    );
  }
  t.end();
});

test("orthogonalize -- compromises on a ring it can't square", (t) => {
  const triangle = polygon([
    [
      [0, 0],
      [0.0005, 0],
      [0.00025, 0.003],
      [0, 0],
    ],
  ]);
  const squared = orthogonalize(triangle);
  t.notDeepEqual(squared, triangle, "moves the ring");
  const start = toMercator(triangle).geometry.coordinates[0];
  const end = toMercator(squared).geometry.coordinates[0];
  const [before, after] = [getAngles(start), getAngles(end)];
  t.ok(
    getErrorDegrees(before, after) < getErrorDegrees(before, before) + 1e-6,
    "gets no further from square"
  );
  t.ok(
    after.every((angle) => angle > 0.1),
    "does not fold"
  );
  const moved = Math.max(
    ...end.map((position, i) =>
      Math.hypot(position[0] - start[i][0], position[1] - start[i][1])
    )
  );
  t.ok(moved < 40, `stays near its input, moved ${moved} m`);
  t.end();
});

test("orthogonalize -- squares a building near the pole", (t) => {
  // Longitude degrees shrink with latitude, so a square on the ground at 89° is wide in degrees.
  const stretch = 1 / Math.cos(degreesToRadians(89));
  const squared = orthogonalize(
    polygon([
      nearSquare.geometry.coordinates[0].map(([longitude, latitude]) => [
        10 + longitude * stretch,
        89 + latitude,
      ]),
    ])
  );
  assertSquare(
    t,
    squared.geometry.coordinates[0].map(([longitude, latitude]) => [
      longitude / stretch,
      latitude,
    ])
  );
  t.end();
});

test("orthogonalize -- FeatureCollection", (t) => {
  const location = point([1, 2]);
  const nothing: Feature<null> = {
    type: "Feature",
    properties: {},
    geometry: null,
  };
  const { features } = orthogonalize<FeatureCollection<Polygon | Point | null>>(
    {
      type: "FeatureCollection",
      features: [nearSquare, location, nothing],
    }
  );
  t.deepEqual(features[0], orthogonalize(nearSquare), "squares polygons");
  t.deepEqual(features[1], location, "copies other geometries");
  t.deepEqual(features[2], nothing, "copies null geometries");
  t.end();
});

test("orthogonalize -- keeps elevation", (t) => {
  const [a, b, c, d] = nearSquare.geometry.coordinates[0];
  for (const ring of [
    [a, b, c, d, a],
    [a, b, [0.0010000999, 0.000050005], c, d, a],
  ]) {
    const squared = orthogonalize(polygon([ring.map(([x, y]) => [x, y, 7])]))
      .geometry.coordinates[0];
    t.equal(squared.length, 5);
    t.ok(squared.every(([, , z]) => z === 7));
  }
  t.end();
});

test("orthogonalize -- rejects bad input", (t) => {
  const limits = {
    toleranceDegrees: 45,
    flatToleranceDegrees: 90,
    diagonalToleranceDegrees: 22.5,
  };
  for (const [name, limit] of Object.entries(limits)) {
    for (const value of [-1, limit + 1, NaN]) {
      t.throws(
        () => orthogonalize(nearSquare, { [name]: value }),
        new RegExp(`${name} must be between 0 and ${limit}`),
        `${name} ${value}`
      );
    }
  }
  t.throws(
    () => orthogonalize(point([0, 0]) as any),
    /Point geometry is not supported/
  );
  t.throws(
    () =>
      orthogonalize({
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0.001, 0],
            [0.001, 0.001],
            [0, 0.001],
          ],
        ],
      }),
    /First and last Position are not equivalent/
  );
  t.throws(
    () =>
      orthogonalize({
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0.001, 0],
            [0, 0],
          ],
        ],
      }),
    /must have 4 or more Positions/
  );
  t.end();
});

test("orthogonalize -- keeps exact coordinates when nothing needs squaring", (t) => {
  const rectangle = polygon([
    [
      [-122.4194155, 37.7749295],
      [-122.4184155, 37.7749295],
      [-122.4184155, 37.7759295],
      [-122.4194155, 37.7759295],
      [-122.4194155, 37.7749295],
    ],
  ]);
  t.deepEqual(orthogonalize(rectangle), rectangle);
  const roundTower = fixtures.find(
    ({ name }) => name === "round-tower"
  )!.geojson;
  t.deepEqual(orthogonalize(roundTower), roundTower);
  t.notDeepEqual(
    orthogonalize(roundTower, { flatToleranceDegrees: 15 }),
    roundTower,
    "a wider flat tolerance flattens the tower"
  );
  t.end();
});

test("orthogonalize -- drops every bbox", (t) => {
  const bbox: [number, number, number, number] = [0, 0, 1, 1];
  const collection: any = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "GeometryCollection",
      bbox,
      geometries: [nearSquare.geometry],
    },
  };
  t.equal(orthogonalize({ ...nearSquare, bbox }).bbox, undefined, "Feature");
  t.equal(
    orthogonalize({ ...nearSquare.geometry, bbox }).bbox,
    undefined,
    "Polygon"
  );
  const bowtie = unchangedFixtures.find(({ name }) => name === "bowtie")!;
  t.equal(
    orthogonalize({ ...bowtie.geojson, bbox }).bbox,
    undefined,
    "ring it leaves unchanged"
  );
  t.equal(
    (orthogonalize(collection) as any).geometry.bbox,
    undefined,
    "bare Feature's GeometryCollection"
  );
  const { features } = orthogonalize(
    featureCollection<any>([
      { ...nearSquare, bbox },
      { ...point([1, 2]), bbox },
      collection,
    ])
  );
  t.equal(features[0].bbox, undefined, "polygon in a FeatureCollection");
  t.equal(features[1].bbox, undefined, "other geometry in a FeatureCollection");
  t.equal(
    features[2].geometry.bbox,
    undefined,
    "GeometryCollection in a FeatureCollection"
  );
  t.end();
});

test("orthogonalize -- squares polygons inside a GeometryCollection", (t) => {
  const geometries = [
    { ...point([1, 2]).geometry, bbox: [1, 2, 1, 2] },
    nearSquare.geometry,
  ] as Geometry[];
  const { features } = orthogonalize<FeatureCollection>(
    featureCollection([
      {
        type: "Feature",
        properties: {},
        geometry: { type: "GeometryCollection", geometries },
      },
    ])
  );
  const [location, squared] = (features[0].geometry as GeometryCollection)
    .geometries;
  t.deepEqual(
    squared,
    orthogonalize(nearSquare.geometry),
    "squares the polygon"
  );
  t.deepEqual(location, point([1, 2]).geometry, "drops the sibling's bbox");
  t.end();
});

test("orthogonalize -- rejects a bare Feature holding a GeometryCollection with a Point", (t) => {
  t.throws(
    () =>
      orthogonalize({
        type: "Feature",
        properties: {},
        geometry: {
          type: "GeometryCollection",
          geometries: [point([1, 2]).geometry],
        },
      } as any),
    /Point geometry is not supported/
  );
  t.end();
});

test("orthogonalize -- keeps the corners square however densely a wall is drawn", (t) => {
  const corners = nearSquare.geometry.coordinates[0];
  for (const density of [4, 16, 64]) {
    const ring = corners
      .slice(0, -1)
      .flatMap(([x, y], i) =>
        Array.from({ length: density }, (_, step) => [
          x + ((corners[i + 1][0] - x) * step) / density,
          y + ((corners[i + 1][1] - y) * step) / density,
        ])
      );
    ring.push(ring[0]);
    const squared = toMercator(orthogonalize(polygon([ring]))).geometry
      .coordinates[0];
    t.equal(squared.length, ring.length, `keeps vertices at ${density}x`);
    assertSquare(t, [
      ...[0, 1, 2, 3].map((corner) => squared[corner * density]),
      squared[0],
    ]);
  }
  t.end();
});

test("orthogonalize -- squares any size of near-square", (t) => {
  for (const scale of [0.01, 0.1, 1, 10, 100]) {
    const scaled = nearSquare.geometry.coordinates[0].map(([x, y]) => [
      x * scale,
      y * scale,
    ]);
    assertSquare(
      t,
      toMercator(orthogonalize(polygon([scaled]))).geometry.coordinates[0]
    );
  }
  t.end();
});

test("orthogonalize -- ignores where a ring starts and which way it winds", (t) => {
  const ring = [
    [10.0000013, 49.9999904],
    [10.0004227, 50.0000046],
    [10.0004053, 50.0000977],
    [10.0002649, 50.0001183],
    [10.0002432, 50.0002136],
    [9.9999868, 50.0002182],
    [10.0000013, 49.9999904],
  ];
  const squared = orthogonalize(polygon([ring])).geometry.coordinates[0];
  const assertSame = (actual: Position[], name: string) =>
    t.ok(
      actual.every(
        (position, i) =>
          Math.hypot(position[0] - squared[i][0], position[1] - squared[i][1]) <
          1e-8
      ),
      name
    );
  const shifted = orthogonalize(
    polygon([[...ring.slice(2, -1), ...ring.slice(0, 2), ring[2]]])
  ).geometry.coordinates[0];
  assertSame(
    [...shifted.slice(4, -1), ...shifted.slice(0, 4), shifted[4]],
    "start vertex"
  );
  assertSame(
    orthogonalize(
      polygon([[...ring].reverse()])
    ).geometry.coordinates[0].reverse(),
    "winding"
  );
  t.end();
});

test("orthogonalize -- squares each part of a MultiPolygon on its own", (t) => {
  const sliver = [
    [0.0009881523926742375, 0.00059748405800201],
    [0.00038771376851946116, 0.0004966128289233894],
    [0.0007051316774450242, 0.0005414671518374235],
    [0.0009881523926742375, 0.00059748405800201],
  ];
  const near = nearSquare.geometry.coordinates[0].map(([x, y]) => [x + 1, y]);
  const [leftAlone, squared] = orthogonalize(multiPolygon([[sliver], [near]]), {
    toleranceDegrees: 45,
  }).geometry.coordinates;
  t.deepEqual(leftAlone[0], sliver, "a part it can't square stays unchanged");
  t.notDeepEqual(squared[0], near, "the other part is still squared");
  t.end();
});

test("orthogonalize -- leaves only the MultiPolygon part whose rings would cross", (t) => {
  const crossing = unchangedFixtures.find(
    ({ name }) => name === "hole-crossing-wall"
  )!.geojson.geometry.coordinates;
  const near = nearSquare.geometry.coordinates[0].map(([x, y]) => [x + 1, y]);
  const [leftAlone, squared] = orthogonalize(multiPolygon([crossing, [near]]))
    .geometry.coordinates;
  t.deepEqual(leftAlone, crossing, "the crossing part stays unchanged");
  t.notDeepEqual(squared[0], near, "the other part is still squared");
  t.end();
});

test("orthogonalize -- leaves degenerate rings as they are", (t) => {
  const rings: Record<string, Position[]> = {
    "identical vertices": [
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
    ],
    "fewer than 3 distinct vertices": [
      [0, 0],
      [0.001, 0],
      [0.001, 0],
      [0, 0],
    ],
    "no area": [
      [0, 0],
      [0.001, 0],
      [0.002, 0],
      [0, 0],
    ],
    "all at the pole": [
      [0, 90],
      [90, 90],
      [180, 90],
      [-90, 90],
      [0, 90],
    ],
    "a NaN coordinate": [
      [0, 0],
      [NaN, 0.001],
      [0.001, 0.001],
      [0, 0],
    ],
  };
  for (const [name, ring] of Object.entries(rings)) {
    t.deepEqual(orthogonalize(polygon([ring])), polygon([ring]), name);
  }
  t.end();
});

test("orthogonalize -- copies empty input", (t) => {
  const empty: Polygon = { type: "Polygon", coordinates: [] };
  t.deepEqual(orthogonalize(empty), empty, "empty Polygon");
  t.deepEqual(
    orthogonalize(featureCollection([])),
    featureCollection([]),
    "empty FeatureCollection"
  );
  const nothing = { type: "Feature", properties: {}, geometry: null };
  t.deepEqual(orthogonalize(nothing as any), nothing, "null geometry");
  t.end();
});

test("orthogonalize -- does not mutate input", (t) => {
  const before = JSON.parse(JSON.stringify(nearSquare));
  orthogonalize(nearSquare);
  t.deepEqual(nearSquare, before);
  t.end();
});
