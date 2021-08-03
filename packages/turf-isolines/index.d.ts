import {
  Point,
  MultiLineString,
  FeatureCollection,
  Properties,
} from "@turf/helpers";

/**
 * http://turfjs.org/docs/#isolines
 */
export default function isolines(
  points: FeatureCollection<Point, any>,
  breaks: number[],
  options?: {
    zProperty?: string;
    commonProperties?: Properties;
    breaksProperties?: Properties[];
  }
): FeatureCollection<MultiLineString>;
