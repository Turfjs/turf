import {
  Point,
  MultiLineString,
  FeatureCollection,
  GeoJsonProperties,
} from "geojson";

/**
 * http://turfjs.org/docs/#isolines
 */
export default function isolines(
  points: FeatureCollection<Point, any>,
  breaks: number[],
  options?: {
    zProperty?: string;
    commonProperties?: GeoJsonProperties;
    breaksProperties?: GeoJsonProperties[];
  }
): FeatureCollection<MultiLineString>;
