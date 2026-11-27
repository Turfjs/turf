import test from "tape";
import {
  point,
  lineString,
  polygon,
  multiPolygon,
  multiLineString,
  multiPoint,
} from "@turf/helpers";
import { multiGeometryScale } from "./index";

test("turf-group-tranlate-multi-polygon", (t) => {
  const multiPoly = multiPolygon([
    [
      [
        [102.0, 2.0],
        [103.0, 2.0],
        [103.0, 3.0],
        [102.0, 3.0],
        [102.0, 2.0],
      ],
    ],
    [
      [
        [100.0, 0.0],
        [101.0, 0.0],
        [101.0, 1.0],
        [100.0, 1.0],
        [100.0, 0.0],
      ],
      [
        [100.2, 0.2],
        [100.8, 0.2],
        [100.8, 0.8],
        [100.2, 0.8],
        [100.2, 0.2],
      ],
    ],
  ]);

  const multiLine = multiLineString([
    [
      [100.0, 0.0],
      [101.0, 1.0],
    ],
    [
      [102.0, 2.0],
      [103.0, 3.0],
    ],
  ]);

  const multiPt = multiPoint([
    [100, 0],
    [0, 100],
  ]);

  const scaleX = 1.5;
  const scaleY = 1.5;
  const angle = 2;

  let strechedPoly = multiGeometryScale(multiPoly, scaleX, scaleY, angle);
  let strechedLine = multiGeometryScale(multiLine, scaleX, scaleY, angle);
  let strechedPoint = multiGeometryScale(multiPt, scaleX, scaleY, angle);

  t.end();
});
