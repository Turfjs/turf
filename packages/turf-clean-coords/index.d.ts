/// <reference types="geojson" />

type GeometryObject = GeoJSON.GeometryObject;
type Feature = GeoJSON.Feature<any>;

/**
 * http://turfjs.org/docs/#cleancoords
 */
export default function <T extends GeometryObject|Feature>(feature: T, mutate?: boolean): T;
