import { Point, Polygon, FeatureCollection, BBox } from "geojson";
import { Units, Grid } from "@turf/helpers";

/**
 * http://turfjs.org/docs/#interpolate
 */
declare function interpolate(
  points: FeatureCollection<Point>,
  cellSize: number,
  options?: {
    gridType?: "point";
    property?: string;
    units?: Units;
    weight?: number;
    bbox?: BBox;
  }
): FeatureCollection<Point>;
declare function interpolate(
  points: FeatureCollection<Point>,
  cellSize: number,
  options?: {
    gridType?: Grid;
    property?: string;
    units?: Units;
    weight?: number;
    bbox?: BBox;
  }
): FeatureCollection<Polygon>;

export { interpolate };
export default interpolate;
