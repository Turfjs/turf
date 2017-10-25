import { lineString, polygon, featureCollection, geometryCollection } from '@turf/helpers'
import lineSegment from './'

const poly = polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
const line = lineString([[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]);
const collection = featureCollection([poly, line]);
const geomCollection = geometryCollection([poly.geometry, line.geometry]);

// Test Types
lineSegment(poly)
lineSegment(line)
lineSegment(collection)
lineSegment(geomCollection)
