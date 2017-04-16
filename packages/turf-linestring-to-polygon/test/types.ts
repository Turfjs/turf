import {featureCollection, lineString} from '@turf/helpers'
import * as polygonToLineString from '../'

const line1 = lineString([[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]);
const line2 = lineString([[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]);

const poly = polygonToLineString(line1);
const polys = polygonToLineString(featureCollection([line1, line2]));
