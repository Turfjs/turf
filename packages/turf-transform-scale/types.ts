import {point, polygon, featureCollection} from '@turf/helpers';
import * as scale from './';

const pt = point([0, 0]);
const poly = polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);

// Does not mutate Geometry type
const scaledPt: GeoJSON.Point = scale(pt.geometry, 1.5);
const scaledPoly: GeoJSON.Feature<GeoJSON.Polygon> = scale(poly, 1.5);

// Diferent Geometry inputs
scale(pt.geometry, 1.5);
scale(poly.geometry, 1.5);
scale(featureCollection([poly]), 1.5, false);

// All params
scale(poly, 1.5);
scale(poly, 1.5, false);
scale(poly, 1.5, true, true);
