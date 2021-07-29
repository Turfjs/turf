import { FeatureCollection, Point, LineString } from "geojson";
import {
  multiPoint,
  multiLineString,
  geometryCollection,
  // Typescript types
} from "@turf/helpers";
import flatten from "./";

const multiPt = multiPoint([
  [0, 0],
  [10, 10],
]);
const multiLine = multiLineString([
  [
    [20, 20],
    [30, 30],
  ],
  [
    [0, 0],
    [10, 10],
  ],
]);

let points: FeatureCollection<Point> = flatten(multiPt);
let lines: FeatureCollection<LineString> = flatten(multiLine);
points = flatten(multiPt.geometry);
lines = flatten(multiLine.geometry);

flatten(geometryCollection([multiPt.geometry, multiLine.geometry]));
