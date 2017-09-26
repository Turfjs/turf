/// <reference types="geojson" />

export type Point = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Point | number[];
export type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

interface Options {
  steps?: number;
  units?: string;
  properties?: { [key: string]: any };
}

/**
 * http://turfjs.org/docs/#circle
 */
export default function (center: Point, radius: number, options?: Options): Polygon;
