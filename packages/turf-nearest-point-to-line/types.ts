import { featureCollection, point, lineString } from '@turf/helpers'
import * as nearestPointToLine from './'

const points = featureCollection([point([0, 0]), point([0.5, 0.5])]);
const line = lineString([[1,1], [-1,1]]);

const nearest: GeoJSON.Feature<GeoJSON.Point> = nearestPointToLine(points, line)
