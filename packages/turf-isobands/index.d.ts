type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type MultiPolygons = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#isobands
 */
declare function isobands(pointGrid: Points, z: string, breaks: Array<number>): MultiPolygons;
declare namespace isobands { }
export = isobands;
