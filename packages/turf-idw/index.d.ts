/// <reference types="geojson" />
import {Units} from '@turf/helpers'

type Points = GeoJSON.FeatureCollection<GeoJSON.Point>;
type Polygons = GeoJSON.FeatureCollection<GeoJSON.Polygon>;

/**
 * http://turfjs.org/docs/
 */
declare function idw(controlPoints: Points, valueField: string, b: number, cellWidth: number, units?: Units): Polygons;
declare namespace idw { }
export = idw;
