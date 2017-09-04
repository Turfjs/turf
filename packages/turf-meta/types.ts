import * as helpers from '@turf/helpers'
import * as meta from './'

// Fixtures
const pt = helpers.point([0, 0])
const line = helpers.lineString([[0, 0], [1, 1]])
const poly = helpers.polygon([[[0, 0], [1, 1], [0, 1], [0, 0]]])
const multiPoly = helpers.multiPolygon([[[[0, 0], [1, 1], [0, 1], [0, 0]]]])
const multiLine = helpers.multiLineString([[[0, 0], [1, 1], [0, 1], [0, 0]], [[2, 2], [3, 3]]])
const geomCollection = helpers.geometryCollection([pt.geometry, line.geometry])
const features = helpers.featureCollection([pt, line])

interface CustomProps {
    foo: string
    bar: number
}

function coordEach() {
    const value: void = meta.coordEach(pt, coords => coords)
    meta.coordEach(pt, (coords, index) => coords)
    meta.coordEach(pt.geometry, coords => { const equal: number[] = coords })
    meta.coordEach(line, coords => { const equal: number[] = coords })
    meta.coordEach(poly, coords => { const equal: number[] = coords })
    meta.coordEach(multiPoly, coords => { const equal: number[] = coords })
    meta.coordEach(geomCollection, coords => coords)
}

function coordReduce() {
    const value: number = meta.coordReduce(pt, (previous, coords) => 1 + 1)
    meta.coordReduce(pt, (previous, coords, index) => coords)
    meta.coordReduce(pt, (previous, coords, index) => 1 + 1, 0)
    meta.coordReduce<number[]>(pt, (previous, coords) => coords)
    meta.coordReduce(geomCollection, (previous, coords) => coords)
}

function propReduce() {
    const value: number = meta.propReduce(poly, (previous, prop) => 1 + 1)
    meta.propReduce(poly, (previous, prop) => 1 + 1, 0)
    meta.propReduce(features, (previous, prop) => prop)
    meta.propReduce(poly, (previous, prop, index) => prop)
    meta.propReduce<number, CustomProps>(poly, (previous, prop) => 1 + 1)
    meta.propReduce(geomCollection, (previous, prop) => prop)
}

function propEach() {
    const value: void = meta.propEach(poly, prop => prop)
    meta.propEach(features, prop => prop)
    meta.propEach(poly, (prop, index) => prop)
    meta.propEach<CustomProps>(poly, prop => prop.bar)
    meta.propEach(geomCollection, prop => prop)
}

function coordAll() {
    const coords: Array<Array<number>> = meta.coordAll(poly)
}

function featureReduce() {
    const value: number = meta.featureReduce(poly, (previous, feature) => 1 + 1)
    meta.featureReduce(poly, (previous, feature) => 1 + 1, 0)
    meta.featureReduce(features, (previous, feature) => feature)
    meta.featureReduce(poly, (previous, feature, index) => feature)
    // meta.featureReduce(geomCollection, (previous, feature, index) => feature)
}

function featureEach() {
    const value: void = meta.featureEach(poly, feature => feature)
    meta.featureEach(features, feature => feature)
    meta.featureEach(poly, (feature, index) => feature)
    // meta.featureEach(geomCollection, (feature, index) => feature)
}

function geomReduce() {
    const value: number = meta.geomReduce(poly, (previous, geom) => 1 + 1)
    meta.geomReduce(poly, (previous, geom) => 1 + 1, 0)
    meta.geomReduce(features, (previous, geom) => geom)
    meta.geomReduce(poly, (previous, geom, index, props) => geom)
    // meta.geomReduce(geomCollection, (previous, geom, index, props) => geom)
}

function geomEach() {
    const value: void = meta.geomEach(poly, geom => geom)
    meta.geomEach(features, geom => geom)
    meta.geomEach(poly, (geom, index, props) => geom)
    // meta.geomEach(geomCollection, (geom, index, props) => geom)
}

function flattenReduce() {
    const value: number = meta.flattenReduce(poly, (previous, feature) => 1 + 1)
    meta.flattenReduce(poly, (previous, feature) => 1 + 1, 0)
    meta.flattenReduce(features, (previous, feature) => feature)
    meta.flattenReduce(poly, (previous, feature, index, props) => feature)
    // meta.flattenReduce(geomCollection, (previous, feature, index, props) => feature)
}

function flattenEach() {
    const value: void = meta.flattenEach(poly, feature => feature)
    meta.flattenEach(features, feature => feature)
    meta.flattenEach(poly.geometry, (feature, index, props) => feature)
    // meta.flattenEach(geomCollection, (feature, index, props) => feature)
}

function segmentReduce() {
    const value: number = meta.segmentReduce(poly, () => 1 + 1)
    meta.segmentReduce(poly, previousValue => previousValue)
    meta.segmentReduce(poly, (previousValue, currentSegment) => currentSegment)
    meta.segmentReduce(poly, (previousValue, currentSegment) => 1 + 1, 0)
    meta.segmentReduce(features, (previousValue, currentSegment) => currentSegment)
    meta.segmentReduce(poly, (previousValue, currentSegment, currentIndex) => currentSegment)
    meta.segmentReduce(geomCollection, (previousValue, currentSegment, currentIndex) => currentSegment)
    meta.segmentReduce(geomCollection, (previousValue, currentSegment, currentIndex, currentSubIndex) => currentSegment)
}

function segmentEach() {
    const value: void = meta.segmentEach(poly, () => {})
    meta.segmentEach(poly, currentSegment => currentSegment)
    meta.segmentEach(features, currentSegment => currentSegment)
    meta.segmentEach(poly.geometry, (currentSegment, currentIndex) => currentSegment)
    meta.segmentEach(geomCollection, (currentSegment, currentIndex) => currentSegment)
    meta.segmentEach(geomCollection, (currentSegment, currentIndex, currentSubIndex) => currentSegment)
}

function lineEach() {
    // meta.lineEach(pt, () => {}) // Argument of type 'Feature<Point>' is not assignable to parameter of type 'LineString | Polygon | MultiPolygon | MultiLineString | Feature<Lines>'.
    const value: void = meta.lineEach(line, () => {})
    meta.lineEach(line, currentLine => currentLine)
    meta.lineEach(multiLine, (currentLine, currentIndex) => currentLine)
    meta.lineEach(poly, currentLine => currentLine)
    meta.lineEach(poly, (currentLine, currentIndex) => currentLine)
    meta.lineEach(multiPoly, (currentLine, currentIndex, currentSubIndex) => currentLine)
}

function lineReduce() {
    // meta.lineReduce(pt, () => {}) // Argument of type 'Feature<Point>' is not assignable to parameter of type 'LineString | Polygon | MultiPolygon | MultiLineString | Feature<Lines>'.
    const value: number = meta.lineReduce(line, () => 1 + 1)
    meta.lineReduce(line, previousValue => previousValue)
    meta.lineReduce(line, (previousValue, currentLine) => currentLine)
    meta.lineReduce(line, (previousValue, currentLine) => 1 + 1, 0)
    meta.lineReduce(multiLine, (previousValue, currentLine) => currentLine)
    meta.lineReduce(multiLine, (previousValue, currentLine, currentIndex) => currentLine)
    meta.lineReduce(poly, (previousValue, currentLine) => currentLine)
    meta.lineReduce(poly, (previousValue, currentLine, currentIndex) => currentLine)
    meta.lineReduce(poly, (previousValue, currentLine, currentIndex) => 1 + 1, 1)
    meta.lineReduce(multiPoly, (previousValue, currentLine, currentIndex, currentSubIndex) => currentLine)
    meta.lineReduce(multiPoly, (previousValue, currentLine, currentIndex, currentSubIndex) => 1 + 1, 1)
}
