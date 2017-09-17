import { geometryCollection, featureCollection, point, lineString } from '@turf/helpers'
import * as nearestPointToLine from './'

const points = featureCollection([point([0, 0]), point([0.5, 0.5])]);
const line = lineString([[1,1], [-1,1]]);

const nearest = nearestPointToLine(points, line)
nearest.properties.dist
nearest.properties.foo

// GeometryCollection
const geomPoints = geometryCollection([point([0, 0]).geometry, point([0.5, 0.5]).geometry]);
nearestPointToLine(geomPoints, line)