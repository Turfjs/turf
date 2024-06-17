import type {
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
} from "geojson";

export type Lines = LineString | MultiLineString | Polygon | MultiPolygon;
