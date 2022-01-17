import {
  Point,
  MultiPolygon,
  FeatureCollection,
  GeoJsonProperties,
} from "geojson";

/**
 * http://turfjs.org/docs/#isobands
 */
export default function isobands(
  points: FeatureCollection<Point>,
  breaks: number[],
  options?: {
    zProperty?: string;
    commonProperties?: GeoJsonProperties;
    breaksProperties?: GeoJsonProperties[];
  }
): FeatureCollection<MultiPolygon>;
