/// <reference types="geojson" />

import {Units} from '@turf/helpers'
type Input = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection

/**
 * http://turfjs.org/docs/#linedistance
 */
declare function lineDistance(geojson: Input, units?: Units): number;
declare namespace lineDistance { }
export = lineDistance;
