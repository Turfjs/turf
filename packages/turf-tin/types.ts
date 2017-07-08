import {point, featureCollection} from '@turf/helpers';
import * as tin from './';

const points = featureCollection([
  point([0, 0], {elevation: 20}),
  point([10, 10], {elevation: 10}),
  point([30, 30], {elevation: 50}),
])
tin(points)
tin(points, 'elevation')
