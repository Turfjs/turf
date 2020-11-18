import {Feature, lineString, LineString, point, Point} from "@turf/helpers";
import clone from "./index";

const pt = point([0, 20]);
const ptCloned: Feature<Point> = clone(pt);

const line = lineString([[0, 20], [10, 10]]).geometry;
const lineCloned: LineString = clone(line);
