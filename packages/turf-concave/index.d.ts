/// <reference types="geojson" />

import {Units} from '@turf/helpers'

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygon = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

/**
 * http://turfjs.org/docs/#concave
 */
declare function concave(points: Points, maxEdge: number, units?: Units): Polygon;
declare namespace concave { }
export = concave;
