import {
    point, lineString, polygon,
    multiPoint, multiLineString, multiPolygon,
    featureCollection, geometryCollection} from '@turf/helpers'
import * as meta from '../index'

const pt = point([0, 0])
const line = lineString([[0, 0], [1, 1]])
const poly = polygon([[[0, 0], [1, 1], [0, 1], [0, 0]]])
const multiPoly = multiPolygon([[[[0, 0], [1, 1], [0, 1], [0, 0]]]])
const geomCollection = geometryCollection([pt.geometry, line.geometry])
const features = featureCollection([pt, line])

// coordEach
meta.coordEach(pt, coords => coords)
meta.coordEach(pt, (coords, index) => coords)
meta.coordEach(pt.geometry, coords => { const equal: number[] = coords })
meta.coordEach(line, coords => { const equal: number[] = coords })
meta.coordEach(poly, coords => { const equal: number[] = coords })
meta.coordEach(multiPoly, coords => { const equal: number[] = coords })

// coordReduce
meta.coordReduce(pt, (previous, coords) => coords)
meta.coordReduce(pt, (previous, coords, index) => coords)
meta.coordReduce(pt, (previous, coords, index) => coords, 0)
meta.coordReduce(pt, (previous, coords) => { const equal: Array<number> = coords })

interface CustomProps {
    foo: string
    bar: number
}

// propReduce
meta.propReduce(poly, (previous, prop) => prop)
meta.propReduce(poly, (previous, prop) => prop, 0)
meta.propReduce(features, (previous, prop) => prop)
meta.propReduce(poly, (previous, prop, index) => prop)
meta.propReduce<CustomProps>(poly, (previous, prop) => prop.foo)

// propEach
meta.propEach(poly, prop => prop)
meta.propEach(features, prop => prop)
meta.propEach(poly, (prop, index) => prop)
meta.propEach<CustomProps>(poly, prop => prop.bar)

// // coordAll
const coords: Array<Array<number>> = meta.coordAll(poly)

// featureReduce
meta.featureReduce(poly, (previous, feature) => feature)
meta.featureReduce(poly, (previous, feature) => feature, 0)
meta.featureReduce(features, (previous, feature) => feature)
meta.featureReduce(poly, (previous, feature, index) => feature)

// featureEach
meta.featureEach(poly, feature => feature)
meta.featureEach(features, feature => feature)
meta.featureEach(poly, (feature, index) => feature)

// geomReduce
meta.geomReduce(poly, (previous, geom) => geom)
meta.geomReduce(poly, (previous, geom) => geom, 0)
meta.geomReduce(features, (previous, geom) => geom)
meta.geomReduce(poly, (previous, geom, index, props) => geom)

// geomEach
meta.geomEach(poly, geom => geom)
meta.geomEach(features, geom => geom)
meta.geomEach(poly, (geom, index, props) => geom)

// flattenReduce
meta.flattenReduce(poly, (previous, feature) => feature)
meta.flattenReduce(poly, (previous, feature) => feature, 0)
meta.flattenReduce(features, (previous, feature) => feature)
meta.flattenReduce(poly, (previous, feature, index, props) => feature)

// flattenEach
meta.flattenEach(poly, feature => feature)
meta.flattenEach(features, feature => feature)
meta.flattenEach(poly, (feature, index, props) => feature)
meta.flattenEach(geomCollection, (feature, index, props) => feature)
