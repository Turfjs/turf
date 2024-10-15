import test from "tape";
import { point, round } from "@turf/helpers";
import { angle } from "./index.js";

test("turf-angle -- across 0 bearing", (t) => {
  t.equal(round(angle([-1, 1], [0, 0], [1, 1])), 90, "90 degrees");

  t.end();
});

test("turf-angle -- 90 degrees", (t) => {
  t.equal(
    round(angle([124, -17], [124, -22], [131, -22]), 6),
    91.312527,
    "91.312527 degrees"
  );
  t.equal(
    round(angle([124, -17], [124, -22], [131, -22], { explementary: true }), 6),
    268.687473,
    "268.687473 degrees explementary"
  );
  t.equal(
    round(angle([124, -17], [124, -22], [131, -22], { mercator: true }), 6),
    90,
    "90 degrees mercator"
  );
  t.equal(
    round(
      angle([124, -17], [124, -22], [131, -22], {
        explementary: true,
        mercator: true,
      }),
      6
    ),
    270,
    "270 degrees explementary mercator"
  );
  t.end();
});

test("turf-angle -- 180 degrees", (t) => {
  t.equal(round(angle([3, -1], [2, 0], [1, 1]), 6), 180, "180 degrees");

  t.end();
});

test("turf-angle -- obtuse", (t) => {
  t.equal(
    round(angle([48.5, 5.5], [51.5, 12], [59, 15.5]), 6),
    218.715175,
    "218.715175 degrees"
  );
  t.equal(
    round(
      angle([48.5, 5.5], [51.5, 12], [59, 15.5], { explementary: true }),
      6
    ),
    141.284825,
    "141.284825 degrees explementary"
  );
  t.equal(
    round(angle([48.5, 5.5], [51.5, 12], [59, 15.5], { mercator: true }), 6),
    219.826106,
    "219.826106 degrees mercator"
  );
  t.equal(
    round(
      angle([48.5, 5.5], [51.5, 12], [59, 15.5], {
        explementary: true,
        mercator: true,
      }),
      6
    ),
    140.173894,
    "140.173894 degrees explementary mercator"
  );
  t.end();
});

test("turf-angle -- obtuse bigger", (t) => {
  t.equal(
    round(angle([48.5, 5.5], [51.5, 12], [46.5, 19]), 6),
    121.330117,
    "121.330117 degrees"
  );
  t.equal(
    round(
      angle([48.5, 5.5], [51.5, 12], [46.5, 19], { explementary: true }),
      6
    ),
    238.669883,
    "238.669883 degrees explementary"
  );
  t.equal(
    round(angle([48.5, 5.5], [51.5, 12], [46.5, 19], { mercator: true }), 6),
    120.970546,
    "120.970546"
  );
  t.equal(
    round(
      angle([48.5, 5.5], [51.5, 12], [46.5, 19], {
        explementary: true,
        mercator: true,
      }),
      6
    ),
    239.029454,
    "239.029454 degrees explementary mercator"
  );
  t.end();
});

test("turf-angle -- acute", (t) => {
  t.equal(
    round(angle([48.5, 5.5], [51.5, 12], [44.5, 10.5]), 6),
    53.608314,
    "53.608314 degrees"
  );
  t.equal(
    round(
      angle([48.5, 5.5], [51.5, 12], [44.5, 10.5], { explementary: true }),
      6
    ),
    306.391686,
    "306.391686 degrees explementary"
  );
  t.equal(
    round(angle([48.5, 5.5], [51.5, 12], [44.5, 10.5], { mercator: true }), 6),
    53.166357,
    "53.166357 degrees mercator"
  );
  t.equal(
    round(
      angle([48.5, 5.5], [51.5, 12], [44.5, 10.5], {
        explementary: true,
        mercator: true,
      }),
      6
    ),
    306.833643,
    "306.833643 degrees explementary mercator"
  );
  t.end();
});

test("turf-angle -- acute inverse", (t) => {
  t.equal(
    round(angle([44.5, 10.5], [51.5, 12], [48.5, 5.5]), 6),
    306.391686,
    "306.391686 degrees"
  );
  t.equal(
    round(
      angle([44.5, 10.5], [51.5, 12], [48.5, 5.5], { explementary: true }),
      6
    ),
    53.608314,
    "53.608314 degrees explementary"
  );
  t.equal(
    round(angle([44.5, 10.5], [51.5, 12], [48.5, 5.5], { mercator: true }), 6),
    306.833643,
    "306.833643 degrees mercator"
  );
  t.equal(
    round(
      angle([44.5, 10.5], [51.5, 12], [48.5, 5.5], {
        explementary: true,
        mercator: true,
      }),
      6
    ),
    53.166357,
    "53.166357 degrees explementary mercator"
  );
  t.end();
});

test("turf-angle -- simple", (t) => {
  t.equal(round(angle([5, 5], [5, 6], [3, 4])), 45, "45 degrees");
  t.equal(round(angle([3, 4], [5, 6], [5, 5])), 315, "315 degrees -- inverse");
  t.equal(
    round(angle([5, 5], [5, 6], [3, 4], { explementary: true })),
    360 - 45,
    "explementary angle"
  );
  t.end();
});

test("turf-angle -- issues", (t) => {
  const start = [167.72709868848324, -45.56543836343071];
  const mid = [167.7269698586315, -45.56691059720167];
  const end = [167.72687866352499, -45.566989345276355];
  const a = angle(start, mid, end);

  t.false(isNaN(a), "result is not NaN");
  t.end();
});

test("turf-angle -- throws", (t) => {
  const pt1 = point([-10, -30]);
  const pt2 = point([-11, -33]);
  const pt3 = point([-12, -36]);
  t.throws(
    () => angle(null, pt2, pt3),
    /startPoint is required/,
    "startPoint is required"
  );
  t.throws(
    () => angle(pt1, undefined, pt3),
    /midPoint is required/,
    "midPoint is required"
  );
  t.throws(
    () => angle(pt1, pt2),
    /endPoint is required/,
    "endPoint is required"
  );
  t.throws(
    () => angle(pt1, pt2, pt3, "string"),
    /options is invalid/,
    "invalid options"
  );

  t.end();
});

test("turf-angle -- 2703", (t) => {
  const start = [0, 1];
  const mid = [0, 0];
  const end = [1, 0];
  const a = angle(start, mid, end);
  t.equal(a, 90, "90 clockwise");

  const start2 = [0, 1];
  const mid2 = [0, 0];
  const end2 = [-1, 0];
  const a2 = angle(start2, mid2, end2);
  t.equal(a2, 270, "270 clockwise");

  t.end();
});
