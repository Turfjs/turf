import { Point, FeatureCollection, Polygon, MultiPolygon } from "geojson";

/**
 * http://turfjs.org/docs/#tag
 */
export default function tag(
  points: FeatureCollection<Point>,
  polygons: FeatureCollection<Polygon | MultiPolygon>,
  field: string,
  outField: string
): FeatureCollection<Point>;
