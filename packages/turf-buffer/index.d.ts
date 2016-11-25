/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/#buffer
 */
declare function buffer(
    features: buffer.Features,
    radius?: number,
    unit?: string): buffer.LineString;
declare namespace buffer {
    type Features = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>;
    type LineString = GeoJSON.Feature<GeoJSON.LineString>;
    type Units = "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres"
}
export = buffer;
