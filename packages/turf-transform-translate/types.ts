import {point, polygon} from '@turf/helpers';
import * as translate from './';

const poly = polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);
const translatedPoly: GeoJSON.Feature<GeoJSON.Polygon> = translate(poly, 100, 35);

const pt = point([0, 0]);
const translatedPt: GeoJSON.Feature<GeoJSON.Point> = translate(pt, 100, 35);