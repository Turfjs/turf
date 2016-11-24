/// <reference types="geojson" />

/***
 * http://turfjs.org/docs/
 */
declare function idw(
    controlPoints: idw.Points,
    valueField: string,
    b: number,
    cellWidth: boolean,
    units?: string): idw.Polygons;
declare namespace idw {
    type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
    type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;
}
export = idw;
