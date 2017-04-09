/// <reference types="geojson" />

type Point = GeoJSON.Feature<GeoJSON.Point>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#sector
 */
declare function sector(center: Point, radius: number, bearing1: number, bearing2: number, steps?: number, units?: string): Polygon;
declare namespace sector {
}
export = sector;
