import type { Feature, Point, Position } from "geojson";

export type Coord = Feature<Point> | Point | Position;
