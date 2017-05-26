import {point, polygon, featureCollection} from '@turf/helpers';
import * as translate from './';

const pt = point([0, 0]);
const poly = polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);

// Does not mutate Geometry type
const translatedPt: GeoJSON.Point = translate(pt.geometry, 100, 35);
const translatedPoly: GeoJSON.Feature<GeoJSON.Polygon> = translate(poly, 100, 35);

// Diferent Geometry inputs
translate(pt.geometry, 100, 35);
translate(poly.geometry, 100, 35);
translate(featureCollection([poly]), 100, 35);

// All params
translate(poly, 100, 35, 'kilometers');
translate(poly, 100, 35, 'kilometers', 10);
translate(poly, 100, 35, 'kilometers', 10, true);
