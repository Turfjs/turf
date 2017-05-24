/// <reference types="geojson" />
import {Point} from '@turf/helpers'

export type GeometryObject = GeoJSON.GeometryObject;
export type Feature<Geom extends GeometryObject> = GeoJSON.Feature<Geom>;

/**
 * http://turfjs.org/docs/#transform-rotate
 */
declare function rotate(geojson: Feature<any> | GeometryObject,
                           angle: number, pivot?: Feature<Point> | GeometryObject | Array<number>): Feature<any>;
declare namespace rotate { }
export = rotate;
