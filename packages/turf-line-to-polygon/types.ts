import { LineString, MultiLineString } from "geojson";
import { featureCollection, lineString, multiLineString } from "@turf/helpers";
import lineToPolygon from "./index";

// Fixtures
const coords = [
  [125, -30],
  [145, -30],
  [145, -20],
  [125, -20],
  [125, -30],
];
const line = lineString(coords);
const multiLine = multiLineString([coords, coords]);
const fc = featureCollection<LineString | MultiLineString>([line, multiLine]);

// Assert results with types
const poly1 = lineToPolygon(line); // Feature<Polygon>
const poly2 = lineToPolygon(multiLine); // Feature<Polygon>
const poly3 = lineToPolygon(fc); // Feature<MultiPolygon>
