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

const haveCrossingEdges = (a: Position[], b: Position[]) => {
  const getSide = (p: Position, q: Position, r: Position) =>
    (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  return a
    .slice(1)
    .some((aEnd, i) =>
      b
        .slice(1)
        .some(
          (bEnd, j) =>
            getSide(a[i], aEnd, b[j]) * getSide(a[i], aEnd, bEnd) < 0 &&
            getSide(b[j], bEnd, a[i]) * getSide(b[j], bEnd, aEnd) < 0
        )
    );
};

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

test("orthogonalize -- squares across repeated vertices and very short edges", (t) => {
  for (const extra of [
    [0.001, 0.00005],
    [0.0010000999, 0.000050005],
  ]) {
    const squared = orthogonalize(
      polygon([
        [
          [0, 0],
          [0.001, 0.00005],
          extra,
          [0.00095, 0.001],
          [-0.00005, 0.00095],
          [0, 0],
        ],
      ])
    );
    const ring = toMercator(squared).geometry.coordinates[0];
    t.equal(ring.length, 5, `merges the edge to ${extra}`);
    assertSquare(t, ring);
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

test("orthogonalize -- leaves a ring unchanged if squaring would cross its edges", (t) => {
  const building = polygon([
    [
      [9.93272, 49.79607],
      [9.9328007, 49.7960902],
      [9.9328254, 49.7960553],
      [9.932829, 49.7960502],
      [9.9327317, 49.7960468],
      [9.93272, 49.79607],
    ],
  ]);
  t.deepEqual(orthogonalize(building), building);
  t.end();
});

test("orthogonalize -- leaves a ring unchanged if squaring settles too slowly", (t) => {
  const pentagon = polygon([
    [
      [10.0000221, 49.9999941],
      [10.0001527, 49.9999852],
      [10.0002248, 50.0000946],
      [10.0001387, 50.0001856],
      [10.000004, 50.0001127],
      [10.0000221, 49.9999941],
    ],
  ]);
  t.deepEqual(orthogonalize(pentagon, { toleranceDegrees: 45 }), pentagon);
  t.end();
});

test("orthogonalize -- settles on a long building that creeps toward square", (t) => {
  const building = polygon([
    [
      [9.9153039, 49.8020556],
      [9.9153809, 49.8020317],
      [9.9155131, 49.8019906],
      [9.9157128, 49.8019285],
      [9.9158112, 49.8018979],
      [9.915869, 49.8018799],
      [9.9160171, 49.8018183],
      [9.9161687, 49.8017552],
      [9.9163575, 49.8016767],
      [9.9164406, 49.8016421],
      [9.9163611, 49.8015693],
      [9.9162139, 49.801629],
      [9.9159516, 49.8017353],
      [9.915823, 49.8017875],
      [9.9157909, 49.8017991],
      [9.915756, 49.8018117],
      [9.9155753, 49.80187],
      [9.9154567, 49.8019082],
      [9.9153573, 49.8019393],
      [9.9152491, 49.8019752],
      [9.9153039, 49.8020556],
    ],
  ]);
  for (const scale of [0.1, 1, 10, 100]) {
    const [originLongitude, originLatitude] =
      building.geometry.coordinates[0][0];
    const scaled = polygon([
      building.geometry.coordinates[0].map(([longitude, latitude]) => [
        originLongitude + (longitude - originLongitude) * scale,
        originLatitude + (latitude - originLatitude) * scale,
      ]),
    ]);
    const angles = getAngles(
      toMercator(orthogonalize(scaled)).geometry.coordinates[0]
    );
    for (const i of [0, 9, 10, 19]) {
      t.ok(
        Math.abs(angles[i] - 90) < 0.5,
        `corner ${i} is within 0.5° of square at ${scale}x`
      );
    }
  }
  t.end();
});

test("orthogonalize -- settles on a building with short edges", (t) => {
  const start = [
    [9.9517011, 49.8020573],
    [9.9515905, 49.8017924],
    [9.9515254, 49.8017938],
    [9.9515169, 49.8017596],
    [9.9513035, 49.8017678],
    [9.9511707, 49.8017757],
    [9.9511711, 49.801786],
    [9.9510131, 49.8017935],
    [9.951021, 49.8018357],
    [9.9510472, 49.8019573],
    [9.9512167, 49.8019464],
    [9.9512148, 49.8018961],
    [9.9514292, 49.8018846],
    [9.9515171, 49.8020796],
    [9.9517011, 49.8020573],
  ];
  const before = getAngles(
    toMercator(polygon([start])).geometry.coordinates[0]
  );
  const after = getAngles(
    toMercator(orthogonalize(polygon([start]))).geometry.coordinates[0]
  );
  const error = getErrorDegrees(before, after);
  t.ok(error < 1, `total error is under 1°, got ${error}`);
  t.end();
});

test("orthogonalize -- brings a building with a diagonal wall closer to square", (t) => {
  const start = [
    [9.9348528, 49.7969079],
    [9.9350119, 49.7969033],
    [9.9349995, 49.7968822],
    [9.9350505, 49.7968875],
    [9.9350547, 49.7968461],
    [9.9349792, 49.7968366],
    [9.9349884, 49.7968236],
    [9.9349433, 49.7967347],
    [9.9349289, 49.7967374],
    [9.9347811, 49.7967687],
    [9.9348528, 49.7969079],
  ];
  const before = getAngles(
    toMercator(polygon([start])).geometry.coordinates[0]
  );
  const after = getAngles(
    toMercator(orthogonalize(polygon([start]))).geometry.coordinates[0]
  );
  const errorBefore = getErrorDegrees(before, before);
  const errorAfter = getErrorDegrees(before, after);
  t.ok(
    errorAfter < errorBefore,
    `error falls from ${errorBefore}° to ${errorAfter}°`
  );
  t.end();
});

test("orthogonalize -- leaves a ring unchanged if squaring would fold it flat", (t) => {
  const sliver = polygon([
    [
      [0.0009881523926742375, 0.00059748405800201],
      [0.00038771376851946116, 0.0004966128289233894],
      [0.0007051316774450242, 0.0005414671518374235],
      [0.0009881523926742375, 0.00059748405800201],
    ],
  ]);
  t.deepEqual(orthogonalize(sliver, { toleranceDegrees: 45 }), sliver);
  t.end();
});

test("orthogonalize -- leaves a ring unchanged if squaring would collapse a wall", (t) => {
  // A pentagon's angles sum to 540°, so five right angles can only be approached by losing a wall.
  const pentagon = polygon([
    [
      [0.001, 0],
      [0.00032, 0.00094],
      [-0.00079, 0.00057],
      [-0.00078, -0.0006],
      [0.00035, -0.00096],
      [0.001, 0],
    ],
  ]);
  t.deepEqual(orthogonalize(pentagon, { toleranceDegrees: 25 }), pentagon);
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

test("orthogonalize -- leaves a ring unchanged if a needle on it would fold", (t) => {
  const needle = polygon([
    [
      [0, 0],
      [0.001, 0],
      [0.001, 0.001],
      [0.0005, 0.001],
      [0.0005, 0.002],
      [0.00049, 0.001],
      [0, 0.001],
      [0, 0],
    ],
  ]);
  t.deepEqual(orthogonalize(needle), needle);
  t.end();
});

test("orthogonalize -- leaves a ring unchanged if a spur folds back along a wall", (t) => {
  // A valid ring, with a 1 m spur running back at 175° along a 40 m wall.
  const metersPerDegree = 111195;
  const stretch = 1 / Math.cos(degreesToRadians(50));
  const toPosition = ([x, y]: number[]) => [
    10 + (x * stretch) / metersPerDegree,
    50 + y / metersPerDegree,
  ];
  const corners = [
    [0, 0],
    [40, 2],
    [40 + Math.cos(degreesToRadians(175)), 2 + Math.sin(degreesToRadians(175))],
    [38, 42],
    [-2, 40],
    [0, 0],
  ];
  const spur = polygon([corners.map(toPosition)]);
  const ring = spur.geometry.coordinates[0];
  t.notOk(haveCrossingEdges(ring, ring), "the input is valid");
  t.deepEqual(orthogonalize(spur), spur);
  t.end();
});

test("orthogonalize -- leaves a self-crossing ring unchanged", (t) => {
  const bowtie = polygon([
    [
      [0, 0],
      [0.001, 0.001],
      [0.001, 0],
      [0, 0.001],
      [0, 0],
    ],
  ]);
  t.deepEqual(orthogonalize(bowtie), bowtie);
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
  const squared = orthogonalize(
    polygon([
      [
        [0, 0, 7],
        [0.001, 0.00005, 7],
        [0.00095, 0.001, 7],
        [-0.00005, 0.00095, 7],
        [0, 0, 7],
      ],
    ])
  );
  t.ok(squared.geometry.coordinates[0].every(([, , z]) => z === 7));
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

test("orthogonalize -- squares near-135° corners", (t) => {
  const chamfered = polygon([
    [
      [0, 0],
      [0.001, 0.00002],
      [0.00098, 0.0006],
      [0.0006, 0.00097],
      [0, 0.001],
      [0, 0],
    ],
  ]);
  const angles = getAngles(
    toMercator(orthogonalize(chamfered)).geometry.coordinates[0]
  );
  for (const i of [2, 3]) {
    t.ok(
      Math.abs(angles[i] - 135) < 0.81,
      `corner ${i} is within 0.81° of 135°`
    );
  }
  t.notDeepEqual(
    orthogonalize(chamfered, { diagonalToleranceDegrees: 0 }),
    orthogonalize(chamfered),
    "a zero diagonal tolerance leaves the diagonals to their neighbors"
  );
  t.end();
});

test("orthogonalize -- squares a near-45° corner", (t) => {
  const wedge = polygon([
    [
      [0, 0],
      [0.002, 0.00005],
      [0.0011, 0.00095],
      [0, 0.001],
      [0, 0],
    ],
  ]);
  const before = getAngles(toMercator(wedge).geometry.coordinates[0]);
  const after = getAngles(
    toMercator(orthogonalize(wedge)).geometry.coordinates[0]
  );
  t.ok(
    Math.abs(before[1] - 45) < 8 && Math.abs(after[1] - 45) < 1,
    `corner 1 moves from ${before[1]}° to ${after[1]}°`
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

test("orthogonalize -- drops the bbox of squared geometries", (t) => {
  const bbox: [number, number, number, number] = [0, 0, 1, 1];
  t.equal(orthogonalize({ ...nearSquare, bbox }).bbox, undefined, "Feature");
  t.equal(
    orthogonalize({ ...nearSquare.geometry, bbox }).bbox,
    undefined,
    "Polygon"
  );
  const { features } = orthogonalize(
    featureCollection<Polygon | Point>([
      { ...nearSquare, bbox },
      { ...point([1, 2]), bbox },
    ])
  );
  t.equal(features[0].bbox, undefined, "polygon in a FeatureCollection");
  t.deepEqual(features[1].bbox, bbox, "other geometry in a FeatureCollection");
  t.end();
});

test("orthogonalize -- drops the bbox of a GeometryCollection holding a squared polygon", (t) => {
  const { features } = orthogonalize<FeatureCollection>({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "GeometryCollection",
          bbox: [0, 0, 1, 1],
          geometries: [nearSquare.geometry],
        },
      },
    ],
  });
  t.equal(features[0].geometry.bbox, undefined);
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

test(
  "orthogonalize -- drops the bbox of a bare Feature's GeometryCollection",
  { todo: true },
  (t) => {
    const squared: any = orthogonalize({
      type: "Feature",
      properties: {},
      geometry: {
        type: "GeometryCollection",
        bbox: [0, 0, 1, 1],
        geometries: [nearSquare.geometry],
      },
    } as any);
    t.equal(squared.geometry.bbox, undefined);
    t.end();
  }
);

test("orthogonalize -- drops the bbox of a ring it leaves unchanged", (t) => {
  const sliver = polygon(
    [
      [
        [0.0009881523926742375, 0.00059748405800201],
        [0.00038771376851946116, 0.0004966128289233894],
        [0.0007051316774450242, 0.0005414671518374235],
        [0.0009881523926742375, 0.00059748405800201],
      ],
    ],
    {},
    { bbox: [0, 0, 1, 1] }
  );
  t.equal(orthogonalize(sliver, { toleranceDegrees: 45 }).bbox, undefined);
  t.end();
});

test("orthogonalize -- merges a very short edge in any direction", (t) => {
  const length = 4.5e-7;
  for (const [x, y] of [
    [1, 0.05],
    [-0.05, 0.95],
    [1, 1 / 3],
    [-1, 1 / 3],
  ]) {
    const norm = Math.hypot(x, y);
    const squared = orthogonalize(
      polygon([
        [
          [0, 0],
          [0.001, 0.00005],
          [0.001 + (length * x) / norm, 0.00005 + (length * y) / norm],
          [0.00095, 0.001],
          [-0.00005, 0.00095],
          [0, 0],
        ],
      ])
    );
    const ring = toMercator(squared).geometry.coordinates[0];
    t.equal(ring.length, 5, `merges the edge toward ${x}, ${y}`);
    assertSquare(t, ring);
  }
  t.end();
});

test("orthogonalize -- merges a very short first or closing edge", (t) => {
  const short = [-0.00000045, 0.00000045];
  const rings = {
    first: [
      [0, 0],
      short,
      [0.001, 0.00005],
      [0.00095, 0.001],
      [-0.00005, 0.00095],
      [0, 0],
    ],
    closing: [
      [0, 0],
      [0.001, 0.00005],
      [0.00095, 0.001],
      [-0.00005, 0.00095],
      short,
      [0, 0],
    ],
  };
  for (const [name, ring] of Object.entries(rings)) {
    const { coordinates } = orthogonalize(polygon([ring])).geometry;
    t.equal(coordinates[0].length, 5, `${name} edge is merged`);
    t.deepEqual(coordinates[0][0], coordinates[0][4], `${name} ring is closed`);
    assertSquare(t, toMercator(polygon(coordinates)).geometry.coordinates[0]);
  }
  t.end();
});

test("orthogonalize -- keeps elevation across a merged edge", (t) => {
  const squared = orthogonalize(
    polygon([
      [
        [0, 0, 7],
        [0.001, 0.00005, 7],
        [0.0010000999, 0.000050005, 7],
        [0.00095, 0.001, 7],
        [-0.00005, 0.00095, 7],
        [0, 0, 7],
      ],
    ])
  );
  t.equal(squared.geometry.coordinates[0].length, 5);
  t.ok(squared.geometry.coordinates[0].every(([, , z]) => z === 7));
  t.end();
});

test("orthogonalize -- keeps a small jog on a long wall", (t) => {
  const stretch = 1 / Math.cos(degreesToRadians(50));
  const metersPerDegree = 111195;
  const jog = polygon([
    [
      [0, 0],
      [300.3, 0.2],
      [299.8, 20.2],
      [150.3, 19.9],
      [149.8, 21.2],
      [0.3, 21.2],
      [0, 0],
    ].map(([x, y]) => [
      10 + (x * stretch) / metersPerDegree,
      50 + y / metersPerDegree,
    ]),
  ]);
  t.equal(orthogonalize(jog).geometry.coordinates[0].length, 7);
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

test("orthogonalize -- a second pass settles most rings but can square new corners", (t) => {
  const getMovedDegrees = (ring: Position[]) => {
    const once = orthogonalize(polygon([ring])).geometry.coordinates[0];
    const twice = orthogonalize(polygon([once])).geometry.coordinates[0];
    return Math.max(
      ...once.map((position, i) =>
        Math.hypot(position[0] - twice[i][0], position[1] - twice[i][1])
      )
    );
  };
  t.ok(getMovedDegrees(nearSquare.geometry.coordinates[0]) < 1e-7, "stable");
  t.ok(
    getMovedDegrees([
      [10.0000013, 49.9999904],
      [10.0004227, 50.0000046],
      [10.0004053, 50.0000977],
      [10.0002649, 50.0001183],
      [10.0002432, 50.0002136],
      [9.9999868, 50.0002182],
      [10.0000013, 49.9999904],
    ]) > 1e-6,
    "moves again once a corner comes into tolerance"
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

test("orthogonalize -- a squared hole can cross its shell", (t) => {
  const shell = [
    [9.9999621, 50.0000137],
    [10.0003913, 50.0000228],
    [10.0004027, 50.0001845],
    [10.0000284, 50.0001819],
    [9.9999621, 50.0000137],
  ];
  const hole = [
    [10.0000257, 50.0000181],
    [10.0000257, 50.000063],
    [10.0001097, 50.000063],
    [10.0001097, 50.0000181],
    [10.0000257, 50.0000181],
  ];
  t.notOk(haveCrossingEdges(shell, hole), "the input is valid");
  const [squaredShell, squaredHole] = orthogonalize(polygon([shell, hole]))
    .geometry.coordinates;
  t.ok(haveCrossingEdges(squaredShell, squaredHole), "the output crosses");
  t.end();
});

test("orthogonalize -- squared parts of a MultiPolygon can cross", (t) => {
  const left = [
    [9.9999893, 50.000005],
    [10.0002991, 49.9999987],
    [10.0002981, 50.0001386],
    [9.9999899, 50.0001468],
    [9.9999893, 50.000005],
  ];
  const right = [
    [10.0003048, 49.9999961],
    [10.0005971, 50.000013],
    [10.0005977, 50.0001418],
    [10.0003039, 50.0001285],
    [10.0003048, 49.9999961],
  ];
  t.notOk(haveCrossingEdges(left, right), "the input is valid");
  const [squaredLeft, squaredRight] = orthogonalize(
    multiPolygon([[left], [right]])
  ).geometry.coordinates;
  t.ok(
    haveCrossingEdges(squaredLeft[0], squaredRight[0]),
    "the output crosses"
  );
  t.end();
});

test("orthogonalize -- a part cut at the antimeridian drifts off 180°", (t) => {
  const { coordinates } = orthogonalize(
    polygon([
      [
        [179.999, 0],
        [180, 0.00005],
        [180, 0.001],
        [179.999, 0.00095],
        [179.999, 0],
      ],
    ])
  ).geometry;
  t.ok(Math.max(...coordinates[0].map(([longitude]) => longitude)) > 180);
  t.notOk(coordinates[0].some(([longitude]) => longitude === 180));
  t.end();
});

test("orthogonalize -- leaves a ring unchanged if squaring would push it past the pole", (t) => {
  const pole = polygon([
    [
      [0, 89.99],
      [90, 89.99],
      [180, 90],
      [-90, 89.99],
      [0, 89.99],
    ],
  ]);
  t.deepEqual(orthogonalize(pole), pole);
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

test("orthogonalize -- keeps repeated vertices in a ring it does not square", (t) => {
  const roundTower = fixtures.find(({ name }) => name === "round-tower")!
    .geojson.geometry.coordinates[0] as Position[];
  const repeated = polygon([[roundTower[0], ...roundTower]]);
  t.deepEqual(orthogonalize(repeated), repeated);
  t.end();
});

test("orthogonalize -- keeps repeated vertices in a ring it rejects", (t) => {
  const pentagon = polygon([
    [
      [0.001, 0],
      [0.00032, 0.00094],
      [0.00032, 0.00094],
      [-0.00079, 0.00057],
      [-0.00078, -0.0006],
      [0.00035, -0.00096],
      [0.001, 0],
    ],
  ]);
  t.deepEqual(orthogonalize(pentagon, { toleranceDegrees: 25 }), pentagon);
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

test("orthogonalize -- throws on null options", (t) => {
  t.throws(() => orthogonalize(nearSquare, null as any), TypeError);
  t.end();
});

test("orthogonalize -- does not mutate input", (t) => {
  const before = JSON.parse(JSON.stringify(nearSquare));
  orthogonalize(nearSquare);
  t.deepEqual(nearSquare, before);
  t.end();
});
