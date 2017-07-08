import {polygon, multiPolygon} from '@turf/helpers';
import * as polygonToLineString from './';

const poly = polygon([[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]]);
const multiPoly = multiPolygon([
  [[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]],
  [[[135, -40], [155, -40], [155, -30], [135, -30], [135, -40]]]
]);

const feature = polygonToLineString(poly);
const collection = polygonToLineString(multiPoly);
