/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#circle
 */
declare function circle(
    center: GeoJSON.Feature<GeoJSON.Point>,
    radius: number,
    steps?: number,
    units?: string): GeoJSON.Feature<GeoJSON.Polygon>;

declare namespace circle { }
export = circle

// import * as circle from './index'

// const center: GeoJSON.Feature<GeoJSON.Point> = {
//     type: "Feature",
//     properties: {},
//     geometry: {type: "Point", coordinates: [-75.343, 39.984]}
// };
// const unit = "kilometers";
// const radius = 5;
// const steps = 10;

// circle(center, radius);
// circle(center, radius, steps);
// circle(center, radius, steps, unit);