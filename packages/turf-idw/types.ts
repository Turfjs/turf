import * as fs from 'fs'
import {point, featureCollection} from '@turf/helpers'
import * as idw from './'

const points = featureCollection([
  point([0, 0], {value: 5}),
  point([10, 10], {value: 15}),
  point([20, 20], {value: 35})
])
idw(points, 'value' , 0.5 , 1)
idw(points, 'value' , 0.5 , 1, 'kilometers')