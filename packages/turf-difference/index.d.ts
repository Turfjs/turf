/// <reference types="geojson" />

import {Polygon, MultiPolygon, Feature} from '@turf/meta'

export type Input = Feature<Polygon|MultiPolygon> | Polygon | MultiPolygon;
export type Output = Feature<Polygon|MultiPolygon> | null;

/**
 * http://turfjs.org/docs/#difference
 */
export default function difference(polygon1: Input, polygon2: Input): Output;

