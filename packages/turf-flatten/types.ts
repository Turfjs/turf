import {multiPoint, multiLineString, geometryCollection} from '@turf/helpers'
import * as flatten from './'

const multiPt = multiPoint([[0, 0], [10, 10]])
const multiLine = multiLineString([[[20, 20], [30, 30]], [[0, 0], [10, 10]]])

flatten(multiPt);
flatten(multiLine);
flatten(multiPt.geometry);
flatten(multiLine.geometry);
flatten(geometryCollection([multiPt.geometry, multiLine.geometry]));
