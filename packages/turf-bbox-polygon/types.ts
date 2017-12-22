import { BBox } from '@turf/helpers'
import bboxPolygon from './'

// Simple
const bbox: BBox = [0, 0, 10, 10]
const poly = bboxPolygon(bbox)

// Custom Properties
const properties = {foo: 'bar'}
const customPoly = bboxPolygon(bbox, {properties})
customPoly.properties.foo
// poly.properties.bar // [ts] Property 'bar' does not exist on type '{ foo: string; }'.
