/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#circle
 */
declare function circle(
    center: circle.Point,
    radius: number,
    steps?: number,
    units?: string): circle.Polygon;
declare namespace circle {
    type Point = GeoJSON.Feature<GeoJSON.Point>;
    type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
    type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres";
}
export = circle;
