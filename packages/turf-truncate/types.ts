import {
  featureCollection,
  point,
  lineString,
  geometryCollection,
} from "@turf/helpers";
import truncate from "./index";

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

truncate(pt);
truncate(ptGeom);
truncate(line);
truncate(lineGeom);
truncate(lines);
truncate(points);
truncate(geomCollection);
truncate(pt, { precision: 6 });
truncate(pt, { precision: 3, coordinates: 2 });
truncate(pt, { precision: 3, coordinates: 2, mutate: false });
