import {point} from '@turf/helpers'
import * as clone from './'

const pt = point([0, 20])
const ptCloned = clone(pt)
const ptClonedAll = clone(pt, true)
