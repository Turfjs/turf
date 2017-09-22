/// <reference types="geojson" />

import {Polygon, MultiPolygon, Feature} from '@turf/meta'

type Input = Feature<Polygon|MultiPolygon> | Polygon | MultiPolygon;
type Output = Feature<Polygon|MultiPolygon> | null;

/**
 * http://turfjs.org/docs/#difference
 */
declare function difference(polygon1: Input, polygon2: Input): Output;
declare namespace difference { }
export = difference;
