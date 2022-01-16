import { Polygon, MultiPolygon, Feature } from "geojson";

/**
 * http://turfjs.org/docs/#difference
 */
export default function difference(
  polygon1: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
  polygon2: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
): Feature<Polygon | MultiPolygon> | null;
