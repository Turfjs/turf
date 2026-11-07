import {
  Feature,
  FeatureCollection,
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
import { featureCollection, point, polygon } from "@turf/helpers";
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
    return (
      (Math.atan2(Math.abs(ax * by - ay * bx), ax * bx + ay * by) * 180) /
      Math.PI
    );
  });

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
  const ring = toMercator(orthogonalize(rectangle)).geometry
    .coordinates[0] as Position[];
  getAngles(ring).forEach((angle, i) => {
    t.ok(Math.abs(angle - 90) < 0.5, `corner ${i} is within 0.5° of square`);
  });
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

test("orthogonalize -- squares across repeated vertices", (t) => {
  const squared = orthogonalize(
    polygon([
      [
        [0, 0],
        [0.001, 0.00005],
        [0.001, 0.00005],
        [0.00095, 0.001],
        [-0.00005, 0.00095],
        [0, 0],
      ],
    ])
  );
  const ring = toMercator(squared).geometry.coordinates[0] as Position[];
  t.equal(ring.length, 5, "drops the repeat");
  getAngles(ring).forEach((angle, i) => {
    t.ok(Math.abs(angle - 90) < 0.5, `corner ${i} is within 0.5° of square`);
  });
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
  ).geometry.coordinates[0] as Position[];
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

test("orthogonalize -- leaves a ring unchanged if squaring never settles", (t) => {
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
  t.deepEqual(orthogonalize(building), building);
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
  const error = after.reduce(
    (sum, angle, i) =>
      Math.abs(before[i] - 90) < 15 ? sum + Math.abs(angle - 90) : sum,
    0
  );
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
  const getError = (angles: number[]) =>
    angles.reduce(
      (sum, angle, i) =>
        Math.abs(before[i] - 90) < 15 ? sum + Math.abs(angle - 90) : sum,
      0
    );
  t.ok(
    getError(after) < getError(before),
    `error falls from ${getError(before)}° to ${getError(after)}°`
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
  t.deepEqual(orthogonalize(sliver, { thresholdDegrees: 45 }), sliver);
  t.end();
});

test("orthogonalize -- compromises on rings it can't square", (t) => {
  const cases: [string, Position[], number, number][] = [
    [
      "thin triangle",
      [
        [0, 0],
        [0.0005, 0],
        [0.00025, 0.003],
        [0, 0],
      ],
      15,
      40,
    ],
    [
      "needle on square shoulders",
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
      15,
      40,
    ],
    [
      "pentagon with five near-square corners",
      [
        [0.001, 0],
        [0.00032, 0.00094],
        [-0.00079, 0.00057],
        [-0.00078, -0.0006],
        [0.00035, -0.00096],
        [0.001, 0],
      ],
      25,
      70,
    ],
  ];
  for (const [name, ring, thresholdDegrees, maxMovedMeters] of cases) {
    const start = toMercator(polygon([ring])).geometry.coordinates[0];
    const squared = toMercator(
      orthogonalize(polygon([ring]), { thresholdDegrees })
    ).geometry.coordinates[0];
    const before = getAngles(start);
    const after = getAngles(squared);
    const getError = (angles: number[]) =>
      angles.reduce(
        (sum, angle, i) =>
          Math.abs(before[i] - 90) < thresholdDegrees
            ? sum + Math.abs(angle - 90)
            : sum,
        0
      );
    // A pentagon's angles sum to 540°, so its total error can't shrink, only stay put.
    t.ok(
      getError(after) < getError(before) + 1e-6,
      `${name} gets no further from square`
    );
    t.ok(
      after.every((angle) => angle > 0.1),
      `${name} does not fold`
    );
    const moved = Math.max(
      ...squared.map((position, i) =>
        Math.hypot(position[0] - start[i][0], position[1] - start[i][1])
      )
    );
    t.ok(
      moved < maxMovedMeters,
      `${name} stays near its input, moved ${moved} m`
    );
  }
  t.end();
});

test("orthogonalize -- squares a building near the pole", (t) => {
  // Longitude degrees shrink with latitude, so a square on the ground at 89° is wide in degrees.
  const stretch = 1 / Math.cos((89 * Math.PI) / 180);
  const squared = orthogonalize(
    polygon([
      nearSquare.geometry.coordinates[0].map(([longitude, latitude]) => [
        10 + longitude * stretch,
        89 + latitude,
      ]),
    ])
  );
  const ring = squared.geometry.coordinates[0].map(([longitude, latitude]) => [
    longitude / stretch,
    latitude,
  ]);
  getAngles(ring).forEach((angle, i) => {
    t.ok(Math.abs(angle - 90) < 0.5, `corner ${i} is within 0.5° of square`);
  });
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

test("orthogonalize -- closes an unclosed ring", (t) => {
  const { coordinates } = orthogonalize({
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0, 0.001],
      ],
    ],
  });
  t.equal(coordinates[0].length, 5);
  t.deepEqual(coordinates[0][0], coordinates[0][4]);
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
  const square = polygon([
    [
      [0, 0],
      [0.001, 0],
      [0.001, 0.001],
      [0, 0.001],
      [0, 0],
    ],
  ]);
  for (const thresholdDegrees of [-1, 46, NaN]) {
    t.throws(
      () => orthogonalize(square, { thresholdDegrees }),
      /thresholdDegrees must be between 0 and 45/,
      `thresholdDegrees ${thresholdDegrees}`
    );
  }
  t.throws(
    () => orthogonalize(point([0, 0]) as any),
    /Point geometry is not supported/
  );
  t.end();
});

test("orthogonalize -- squares near-45° and near-135° corners", (t) => {
  const ring = toMercator(
    orthogonalize(
      polygon([
        [
          [0, 0],
          [0.001, 0.00002],
          [0.00098, 0.0006],
          [0.0006, 0.00097],
          [0, 0.001],
          [0, 0],
        ],
      ])
    )
  ).geometry.coordinates[0] as Position[];
  const angles = getAngles(ring);
  for (const i of [2, 3]) {
    t.ok(
      Math.abs(angles[i] - 135) < 0.81,
      `corner ${i} is within 0.81° of 135°`
    );
  }
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
  t.end();
});

test("orthogonalize -- does not mutate input", (t) => {
  const before = JSON.parse(JSON.stringify(nearSquare));
  orthogonalize(nearSquare);
  t.deepEqual(nearSquare, before);
  t.end();
});
