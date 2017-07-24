import {
    point, lineString, polygon,
    multiPoint, multiLineString, multiPolygon,
    featureCollection, geometryCollection} from '@turf/helpers'
import * as meta from './'

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
meta.coordEach(geomCollection, coords => coords)

// coordReduce
meta.coordReduce(pt, (previous, coords) => coords)
meta.coordReduce(pt, (previous, coords, index) => coords)
meta.coordReduce(pt, (previous, coords, index) => coords, 0)
meta.coordReduce(pt, (previous, coords) => { const equal: Array<number> = coords })
meta.coordReduce(geomCollection, (previous, coords) => coords)

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
meta.propReduce(geomCollection, (previous, prop) => prop)

// propEach
meta.propEach(poly, prop => prop)
meta.propEach(features, prop => prop)
meta.propEach(poly, (prop, index) => prop)
meta.propEach<CustomProps>(poly, prop => prop.bar)
meta.propEach(geomCollection, prop => prop)

// // coordAll
const coords: Array<Array<number>> = meta.coordAll(poly)

// featureReduce
meta.featureReduce(poly, (previous, feature) => feature)
meta.featureReduce(poly, (previous, feature) => feature, 0)
meta.featureReduce(features, (previous, feature) => feature)
meta.featureReduce(poly, (previous, feature, index) => feature)
// meta.featureReduce(geomCollection, (previous, feature, index) => feature)

// featureEach
meta.featureEach(poly, feature => feature)
meta.featureEach(features, feature => feature)
meta.featureEach(poly, (feature, index) => feature)
// meta.featureEach(geomCollection, (feature, index) => feature)

// geomReduce
meta.geomReduce(poly, (previous, geom) => geom)
meta.geomReduce(poly, (previous, geom) => geom, 0)
meta.geomReduce(features, (previous, geom) => geom)
meta.geomReduce(poly, (previous, geom, index, props) => geom)
// meta.geomReduce(geomCollection, (previous, geom, index, props) => geom)

// geomEach
meta.geomEach(poly, geom => geom)
meta.geomEach(features, geom => geom)
meta.geomEach(poly, (geom, index, props) => geom)
// meta.geomEach(geomCollection, (geom, index, props) => geom)

// flattenReduce
meta.flattenReduce(poly, (previous, feature) => feature)
meta.flattenReduce(poly, (previous, feature) => feature, 0)
meta.flattenReduce(features, (previous, feature) => feature)
meta.flattenReduce(poly, (previous, feature, index, props) => feature)
// meta.flattenReduce(geomCollection, (previous, feature, index, props) => feature)

// flattenEach
meta.flattenEach(poly, feature => feature)
meta.flattenEach(features, feature => feature)
meta.flattenEach(poly.geometry, (feature, index, props) => feature)
// meta.flattenEach(geomCollection, (feature, index, props) => feature)

// segmentReduce
meta.segmentReduce(poly, () => {})
meta.segmentReduce(poly, previousValue => previousValue)
meta.segmentReduce(poly, (previousValue, currentSegment) => currentSegment)
meta.segmentReduce(poly, (previousValue, currentSegment) => currentSegment, 0)
meta.segmentReduce(features, (previousValue, currentSegment) => currentSegment)
meta.segmentReduce(poly, (previousValue, currentSegment, currentIndex) => currentSegment)
meta.segmentReduce(geomCollection, (previousValue, currentSegment, currentIndex) => currentSegment)

// segmentEach
meta.segmentEach(poly, () => {})
meta.segmentEach(poly, currentSegment => currentSegment)
meta.segmentEach(features, currentSegment => currentSegment)
meta.segmentEach(poly.geometry, (currentSegment, currentIndex) => currentSegment)
meta.segmentEach(geomCollection, (currentSegment, currentIndex) => currentSegment)
