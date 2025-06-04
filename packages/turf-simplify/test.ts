import fs from "fs";
import test from "tape";
import path from "path";
import { fileURLToPath } from "url";
import { loadJsonFileSync } from "load-json-file";
import { writeJsonFileSync } from "write-json-file";
import { truncate } from "@turf/truncate";
import { polygon, multiPolygon } from "@turf/helpers";
import { simplify } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = {
  in: path.join(__dirname, "test", "in") + path.sep,
  out: path.join(__dirname, "test", "out") + path.sep,
};

let fixtures = fs.readdirSync(directories.in).map((filename) => {
  return {
    filename,
    name: path.parse(filename).name,
    geojson: loadJsonFileSync(directories.in + filename),
  };
});
// fixtures = fixtures.filter(({name}) => name.includes('#555'));

test("simplify", (t) => {
  for (const { filename, name, geojson } of fixtures) {
    let { tolerance, highQuality } = geojson.properties || {};
    tolerance = tolerance || 0.01;
    highQuality = highQuality || false;

    const simplified = truncate(
      simplify(geojson, {
        tolerance: tolerance,
        highQuality: highQuality,
      })
    );

    if (process.env.REGEN)
      writeJsonFileSync(directories.out + filename, simplified);
    t.deepEqual(simplified, loadJsonFileSync(directories.out + filename), name);
  }

  t.end();
});

test("simplify -- throw", (t) => {
  const poly = polygon([
    [
      [0, 0],
      [2, 2],
      [2, 0],
      [0, 0],
    ],
  ]);
  t.throws(() => simplify(null), /geojson is required/, "missing geojson");
  t.throws(
    () => simplify(poly, { tolerance: -1 }),
    /invalid tolerance/,
    "negative tolerance"
  );
  t.end();
});

test("simplify -- removes ID & BBox from properties", (t) => {
  const properties = { foo: "bar" };
  const id = 12345;
  const bbox = [0, 0, 2, 2];
  const poly = polygon(
    [
      [
        [0, 0],
        [2, 2],
        [2, 0],
        [0, 0],
      ],
    ],
    properties,
    { bbox, id }
  );
  const simple = simplify(poly, { tolerance: 0.1 });

  t.equal(simple.id, id);
  t.deepEqual(simple.bbox, bbox);
  t.deepEqual(simple.properties, properties);
  t.end();
});

test("simplify -- issue #555", (t) => {
  // polygons from issue #555
  const poly1 = polygon([
    [
      [-75.693254, 45.431144],
      [-75.693335, 45.431109],
      [-75.693335, 45.431109],
      [-75.693254, 45.431144],
    ],
  ]);
  const poly2 = polygon([
    [
      [-75.627178, 45.438106],
      [-75.627179, 45.438106],
      [-75.62718, 45.438106],
      [-75.627178, 45.438106],
    ],
  ]);
  const poly3 = polygon([
    [
      [-75.684722, 45.410083],
      [-75.684641, 45.409989],
      [-75.684641, 45.409989],
      [-75.684722, 45.410083],
      [-75.684722, 45.410083],
    ],
  ]);
  const poly4 = polygon([
    [
      [-75.885634, 45.272762],
      [-75.885482, 45.272641],
      [-75.885554, 45.272596],
      [-75.885534, 45.272581],
      [-75.885581, 45.272551],
      [-75.885703, 45.272647],
      [-75.885706, 45.272645],
      [-75.885709, 45.272647],
      [-75.885767, 45.272693],
      [-75.885759, 45.272698],
      [-75.885716, 45.272728],
      [-75.885716, 45.272728],
      [-75.885712, 45.272731],
      [-75.885712, 45.272731],
      [-75.885708, 45.272734],
      [-75.885684, 45.272749],
      [-75.885671, 45.272739],
      [-75.885634, 45.272762],
    ],
    [
      [-75.885708, 45.27273],
      [-75.885708, 45.272729],
      [-75.885708, 45.272729],
      [-75.885708, 45.27273],
    ],
  ]);
  const options = { tolerance: 0.000001, highQuality: true };

  t.throws(() => simplify(poly1, options), /invalid polygon/);
  t.throws(() => simplify(poly2, options), /invalid polygon/);
  t.throws(() => simplify(poly3, options), /invalid polygon/);
  t.throws(() => simplify(poly4, options), /invalid polygon/);
  t.end();
});

test("simplify -- issue #918", (t) => {
  // simplify hangs on this input #918
  t.throws(
    () =>
      simplify(
        multiPolygon([
          [
            [
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
              [0, 90],
            ],
          ],
        ])
      ),
    /invalid polygon/,
    "invalid polygon"
  );
  t.throws(
    () =>
      simplify(
        multiPolygon([
          [
            [
              [0, 1],
              [0, 2],
              [0, 3],
              [0, 2.5],
              [0, 1],
            ],
          ],
        ])
      ),
    /invalid polygon/,
    "invalid polygon"
  );
  t.throws(
    () =>
      simplify(
        multiPolygon([
          [
            [
              [0, 1],
              [0, 1],
              [1, 2],
              [0, 1],
            ],
          ],
        ])
      ),
    /invalid polygon/,
    "invalid polygon"
  );
  t.end();
});

test("simplify - issue 1788 - infinite loop", (t) => {
  // For particularly small polygons simplify was getting stuck in an
  // infinite loop.

  // https://github.com/Turfjs/turf/issues/1788#issue-521052548
  const poly1 = polygon([
    [
      [11.662180661499999, 50.1081498005],
      [11.662192661499999, 50.108041800500004],
      [11.6621866615, 50.1080958005],
      [11.662180661499999, 50.1081498005],
    ],
  ]);
  simplify(poly1, {
    tolerance: 0.000001,
    highQuality: true,
    mutate: false,
  });
  t.pass("issue 1788 test 1 didn't hang");

  // https://github.com/Turfjs/turf/issues/1788#issuecomment-951109683
  const poly2 = polygon([
    [
      [4.0881641, 6.8121605],
      [4.0881639, 6.8121607],
      [4.0881638, 6.8121608],
      [4.0881641, 6.8121605],
    ],
  ]);
  simplify(poly2);
  t.pass("issue 1788 test 2 didn't hang");

  // https://github.com/Turfjs/turf/issues/1788#issuecomment-1362073785
  const poly3 = multiPolygon([
    [
      [
        [-10.06762725, -17.428977611],
        [-10.067626613, -17.428977323],
        [-10.067625943, -17.428976957],
        [-10.06762725, -17.428977611],
      ],
    ],
    [
      [
        [-10.067625943, -17.428976957],
        [-10.067599027, -17.428963499],
        [-10.067625941, -17.428976956],
        [-10.067625943, -17.428976957],
      ],
    ],
  ]);
  simplify(poly3, { tolerance: 0.00001, highQuality: true });
  t.pass("issue 1788 test 3 didn't hang");

  t.end();
});
