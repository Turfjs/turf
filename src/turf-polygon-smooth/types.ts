import { polygon } from '@turf/helpers'
import polygonSmooth from '.'

const poly = polygon([[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]])

polygonSmooth(poly)
polygonSmooth(poly, {iterations: 3})
