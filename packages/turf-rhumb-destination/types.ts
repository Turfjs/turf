import { point, Point, Feature } from '@turf/helpers'
import rhumbDestination from './'

const pt = point([-75.343, 39.984], {foo: 'bar'})
const distance = 50
const bearing = 90

rhumbDestination(pt, distance, bearing)
rhumbDestination(pt, distance, bearing, {units: 'miles'})

// Allow defining custom properties to output point
interface CustomPoint extends Feature<Point> {
  properties: {
    foo: string
  }
}
const customPoint: CustomPoint = rhumbDestination(pt, distance, bearing)
customPoint.properties.foo
// customPoint.properties.hello // [ts] Property 'hello' does not exist on type '{ foo: string; }'.
