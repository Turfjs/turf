import {point} from '@turf/helpers'
import * as greatCircle from './'

const pt1 = point([0, 0])
const pt2 = point([60, 0])
greatCircle(pt1, pt2)
greatCircle(pt1.geometry, pt2.geometry)
greatCircle(pt1.geometry.coordinates, pt2.geometry.coordinates)
greatCircle(pt1, pt2, {'name': 'Seattle to DC'})
greatCircle(pt1, pt2, {}, 100)
greatCircle(pt1, pt2, {}, 100, 10)

