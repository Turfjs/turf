import * as helpers from './'
import {
    BBox,
    feature,
    featureCollection,
    geometry,
    point,
    polygon,
    lineString,
    multiLineString,
    multiPoint,
    multiPolygon,
    geometryCollection,
    radiansToLength,
    lengthToRadians,
    lengthToDegrees,
    bearingToAzimuth,
    radiansToDegrees,
    degreesToRadians,
    round,
    convertLength,
    convertArea,
    isNumber,
    isObject,
    earthRadius,
    // Typescript types
    Point,
    Geometries,
    LineString,
    Polygon,
    MultiPoint,
    MultiLineString,
    MultiPolygon,
    GeometryCollection
} from './'

// Fixtures
const bbox: BBox = [-180, -90, 180, 90]
const properties = {foo: 'bar'}
const pt = point([0, 1])
const line = lineString([[0, 1], [2, 3]])
const poly = polygon([[[0, 1], [0, 0], [2, 3], [0, 1]]])
const feat = feature({coordinates: [1, 0], type: 'point'})
const multiPt = multiPoint([[0, 1], [2, 3], [0, 1]])
const multiLine = multiLineString([[[0, 1], [2, 3], [0, 1]]])
const multiPoly = multiPolygon([[[[0, 1], [0, 0], [2, 3], [0, 1]]]])

// radiansToLength & lengthToRadians
radiansToLength(5)
lengthToRadians(10)
lengthToDegrees(45)

// default import & import * as
point([0, 1])
lineString([[0, 1], [2, 3]])
polygon([[[0, 1], [0, 0], [2, 3], [0, 1]]])
feature({coordinates: [1, 0], type: 'point'})
multiPoint([[0, 1], [2, 3], [0, 1]])
multiLineString([[[0, 1], [2, 3], [0, 1]]])
multiPolygon([[[[0, 1], [0, 0], [2, 3], [0, 1]]]])

// Mixed collection is defiend as FeatureCollection<any>
const mixed = featureCollection<Point | LineString | Polygon>([pt, poly])
mixed.features.push(pt)
mixed.features.push(line)
mixed.features.push(poly)

// Blank collection is defined as FeatureCollection<any>
const blank = featureCollection<Point | LineString | Polygon>([])
blank.features.push(pt)
blank.features.push(line)
blank.features.push(poly)

// Collection with only Points
const points = featureCollection<Point>([])
points.features.push(pt)
// points.features.push(line) // Argument of type 'Feature<LineString>' is not assignable to parameter of type 'Feature<Point>'.

// Collection with only LineStrings
const lines = featureCollection([line])
lines.features.push(line)
// lines.features.push(pt) // Argument of type 'Feature<Point>' is not assignable to parameter of type 'Feature<LineString>'.

// Collection with only Polygons
const polygons = featureCollection<Polygon>([])
polygons.features.push(poly)

// bbox & id
point(pt.geometry.coordinates, properties, {bbox, id: 1})
lineString(line.geometry.coordinates, properties, {bbox, id: 1})
polygon(poly.geometry.coordinates, properties, {bbox, id: 1})
multiPoint(multiPt.geometry.coordinates, properties, {bbox, id: 1})
multiLineString(multiLine.geometry.coordinates, properties, {bbox, id: 1})
multiPolygon(multiPoly.geometry.coordinates, properties, {bbox, id: 1})
geometryCollection([pt.geometry], properties, {bbox, id: 1})

// properties
point(pt.geometry.coordinates, {foo: 'bar'})
point(pt.geometry.coordinates, {1: 2})
point(pt.geometry.coordinates, {1: {foo: 'bar'}})

// isNumber -- true
isNumber(123)
isNumber(1.23)
isNumber(-1.23)
isNumber(-123)
isNumber('123')
isNumber(+'123')
isNumber('1e10000')
isNumber(1e10000)
isNumber(Infinity)
isNumber(-Infinity)

// isNumber -- false
isNumber(+'ciao')
isNumber('foo')
isNumber('10px')
isNumber(NaN)
isNumber(undefined)
isNumber(null)
isNumber({a: 1})
isNumber({})
isNumber([1, 2, 3])
isNumber([])
isNumber(isNumber)

// isObject -- true
isObject({a: 1})
isObject({})
isObject(point([0, 1]))

// isObject -- false
isObject(123)
isObject(Infinity)
isObject(-123)
isObject('foo')
isObject(NaN)
isObject(undefined)
isObject(null)
isObject([1, 2, 3])
isObject([])
isObject(isNumber)

// Geometry
const ptGeom: Point = geometry('Point', pt.geometry.coordinates);
const lineGeom: LineString = geometry('LineString', line.geometry.coordinates);
const polyGeom: Polygon = geometry('Polygon', poly.geometry.coordinates);
const multiPtGeom: MultiPoint = geometry('MultiPoint', multiPt.geometry.coordinates);
const multiLineGeom: MultiLineString = geometry('MultiLineString', multiLine.geometry.coordinates);
const multiPolyGeom: MultiPolygon = geometry('MultiPolygon', multiPoly.geometry.coordinates);

// Custom Properties
const customPt = point([10, 50], {foo: 'bar'})

// Handle GeometryCollection & Feature.GeometryCollection
const geomCollection = geometryCollection([pt.geometry, line.geometry])
const p1 = geomCollection.geometry.geometries[0]
const l1 = geomCollection.geometry.geometries[0]

const mixedGeomCollection = featureCollection([pt, geomCollection])
const featureGeomCollection = feature(geomCollection.geometry)
