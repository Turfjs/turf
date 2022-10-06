import {
  Feature,
  FeatureCollection,
  Point,
  Polygon,
  MultiPolygon,
} from "geojson";
import { Coord } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#polygontangents
 */
export default function <T extends Polygon | MultiPolygon>(
  point: Coord,
  polygon: Feature<T> | T
): FeatureCollection<Point>;
