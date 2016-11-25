/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#distance
 */
declare function distance(
    from: distance.Point,
    to: distance.Point,
    units?: string): number;
declare namespace distance {
    type Point = GeoJSON.Feature<GeoJSON.Point>;
    type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres";
}
export = distance;
