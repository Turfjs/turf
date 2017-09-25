import { lineString } from '@turf/helpers'
import lineIntersect from './'

const line1 = lineString([[0, 0], [1, 1]]);
const line2 = lineString([[1, 1], [0, 0]]);

lineIntersect(line1, line2);
lineIntersect(line1.geometry, line2.geometry);
