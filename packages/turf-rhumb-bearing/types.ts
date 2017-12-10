import { point, lineString, Properties } from '@turf/helpers'
import rhumbBearing from './'

const point1 = point<Properties>([-75.343, 39.984], {"marker-color": "#F00"})
const point2 = point<Properties>([-75.534, 39.123], {"marker-color": "#00F"})
const bearing = rhumbBearing(point1, point2)

//addToMap
const addToMap = [point1, point2]
point1.properties.bearing = bearing
point2.properties.bearing = bearing
