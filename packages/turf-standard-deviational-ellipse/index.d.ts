import {
  FeatureCollection,
  Feature,
  Position,
  Polygon,
  GeoJsonProperties,
  Point,
} from "geojson";

/**
 * http://turfjs.org/docs/#standarddeviational-ellipse
 */

declare interface SDEProps {
  meanCenterCoordinates: Position;
  semiMajorAxis: number;
  semiMinorAxis: number;
  numberOfFeatures: number;
  angle: number;
  percentageWithinEllipse: number;
}

declare interface StandardDeviationalEllipse extends Feature<Polygon> {
  properties: {
    standardDeviationalEllipse: SDEProps;
    [key: string]: any;
  };
}

declare function standardDeviationalEllipse(
  points: FeatureCollection<Point>,
  options?: {
    properties?: GeoJsonProperties;
    weight?: string;
    steps?: number;
  }
): StandardDeviationalEllipse;

export { SDEProps, StandardDeviationalEllipse, standardDeviationalEllipse };
export default standardDeviationalEllipse;
