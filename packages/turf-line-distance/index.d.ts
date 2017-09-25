/// <reference types="geojson" />

import { Units } from '@turf/helpers'

export type Input = GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any> | GeoJSON.GeometryObject | GeoJSON.GeometryCollection

/**
 * http://turfjs.org/docs/#linedistance
 */
export default function lineDistance(geojson: Input, units?: Units): number;
