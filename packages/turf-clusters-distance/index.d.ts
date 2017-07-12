/// <reference types="geojson" />

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;

/**
 * http://turfjs.org/docs/#clusterdistance
 */
declare function clustersDistance(points: Points, maxDistance: number, minPoints?: number): Points;
declare namespace clustersDistance { }
export = clustersDistance;
