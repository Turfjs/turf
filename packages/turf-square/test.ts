import { BBox } from "geojson";
import test from "tape";
import { square } from "./index.js";

test("square", function (t) {
  const bbox1: BBox = [0, 0, 5, 10];
  const bbox2: BBox = [0, 0, 10, 5];

  const sq1 = square(bbox1);
  const sq2 = square(bbox2);

  t.deepEqual(sq1, [-2.5, 0, 7.5, 10]);
  t.deepEqual(sq2, [0, -2.5, 10, 7.5]);
  t.end();
});

test("square -- surrounds the input away from the equator", function (t) {
  // Wider than they are tall in degrees, but the great circle distance along
  // their southern edge is the shorter of the two.
  const bbox1: BBox = [0, 60, 10, 66];
  const bbox2: BBox = [100, -70, 112, -63];

  t.deepEqual(square(bbox1), [0, 58, 10, 68]);
  t.deepEqual(square(bbox2), [100, -72.5, 112, -60.5]);
  t.end();
});
