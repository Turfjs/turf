/// <reference types="geojson" />

type Polygon = GeoJSON.Feature<GeoJSON.Polygon>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/#tesselate
 */
declare function tesselate(polygon: Polygon): Polygons;
declare namespace tesselate { }
export = tesselate;
