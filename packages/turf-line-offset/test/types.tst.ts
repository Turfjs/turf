import { lineOffset } from "../index.js";
import { lineString, multiLineString } from "@turf/helpers";
import type { Feature, LineString, MultiLineString } from "geojson";

import { expect } from "tstyche";

const line = lineString([
  [0, 0],
  [10, 10],
]);
const multiLine = multiLineString([
  [
    [0, 0],
    [10, 10],
  ],
  [
    [5, 5],
    [15, 15],
  ],
]);

/**
 * If the syntax below starts generating errors it's possible you've narrowed
 * the input arguments which is likely to be a breaking change.
 */
expect(lineOffset).type.toBeCallableWith(line, 50);
expect(lineOffset).type.toBeCallableWith(line.geometry, 50);
expect(lineOffset).type.toBeCallableWith(multiLine, 50);
expect(lineOffset).type.toBeCallableWith(multiLine.geometry, 50);
expect(lineOffset).type.toBeCallableWith(line, 50, { units: "miles" });

/**
 * If the sytax in this section starts generating errors, it's possible you've
 * broadened the return type which is likely to be a breaking change.
 */
expect(lineOffset(line, 50)).type.toBe<Feature<LineString>>();
expect(lineOffset(multiLine, 50)).type.toBe<Feature<MultiLineString>>();
