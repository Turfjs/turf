/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon> | GeoJSON.Polygon;

interface Mask {
    /**
     * http://turfjs.org/docs/#mask
     */
    (poly: Polygon, mask?: Polygon): Polygon;
}
declare const mask: Mask;
export = mask;
