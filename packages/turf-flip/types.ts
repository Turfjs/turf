import {
  featureCollection,
  point,
  lineString,
  geometryCollection,
} from "@turf/helpers";
import flip from "./";

const pt = point([120.1234567, 40.1234567]);
const ptGeom = pt.geometry;
const line = lineString([
  [20, 80],
  [50, 40],
]);
const lineGeom = line.geometry;
const points = featureCollection([pt]);
const lines = featureCollection([line]);
const geomCollection = geometryCollection([ptGeom, lineGeom]);

flip(pt);
flip(ptGeom);
flip(line);
flip(lineGeom);
flip(lines);
flip(points);
flip(geomCollection, { mutate: true });
