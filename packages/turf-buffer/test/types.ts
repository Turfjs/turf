import {point} from '@turf/helpers'
import * as buffer from '../'

const pt = point([100, 0])

buffer(pt, 5, 'miles')
buffer(pt, 10, 'miles', 64)