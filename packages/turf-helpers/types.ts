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
    radiansToDistance,
    distanceToRadians,
    distanceToDegrees,
    bearingToAngle,
    radians2degrees,
    degrees2radians,
    round,
    convertDistance,
    convertArea,
    isNumber } from './'

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

// radiansToDistance & distanceToRadians
helpers.radiansToDistance(5)
helpers.distanceToRadians(10)
helpers.distanceToDegrees(45)

// default import & import * as
point([0, 1])
lineString([[0, 1], [2, 3]])
polygon([[[0, 1], [0, 0], [2, 3], [0, 1]]])
feature({coordinates: [1, 0], type: 'point'})
multiPoint([[0, 1], [2, 3], [0, 1]])
multiLineString([[[0, 1], [2, 3], [0, 1]]])
multiPolygon([[[[0, 1], [0, 0], [2, 3], [0, 1]]]])
helpers.point([0, 1])
helpers.lineString([[0, 1], [2, 3]])
helpers.polygon([[[0, 1], [0, 0], [2, 3], [0, 1]]])
helpers.feature({coordinates: [1, 0], type: 'point'})
helpers.multiPoint([[0, 1], [2, 3], [0, 1]])
helpers.multiLineString([[[0, 1], [2, 3], [0, 1]]])
helpers.multiPolygon([[[[0, 1], [0, 0], [2, 3], [0, 1]]]])

// Mixed collection is defiend as FeatureCollection<any>
const mixed = helpers.featureCollection([pt, poly])
mixed.features.push(pt)
mixed.features.push(line)
mixed.features.push(poly)

// Blank collection is defined as FeatureCollection<any>
const blank = helpers.featureCollection([])
blank.features.push(pt)
blank.features.push(line)
blank.features.push(poly)

// Collection with only Points
const points = helpers.featureCollection<GeoJSON.Point>([])
points.features.push(pt)
// points.features.push(line) // Argument of type 'Feature<LineString>' is not assignable to parameter of type 'Feature<Point>'.

// Collection with only LineStrings
const lines = helpers.featureCollection([line])
lines.features.push(line)
// lines.features.push(pt) // Argument of type 'Feature<Point>' is not assignable to parameter of type 'Feature<LineString>'.

// Collection with only Polygons
const polygons = helpers.featureCollection<GeoJSON.Polygon>([])
polygons.features.push(poly)

// Geometry Collection
const geomCollection = helpers.geometryCollection([pt.geometry])
geomCollection.geometry.geometries

// bbox & id
helpers.point(pt.geometry.coordinates, properties, bbox, 1)
helpers.lineString(line.geometry.coordinates, properties, bbox, 1)
helpers.polygon(poly.geometry.coordinates, properties, bbox, 1)
helpers.multiPoint(multiPt.geometry.coordinates, properties, bbox, 1)
helpers.multiLineString(multiLine.geometry.coordinates, properties, bbox, 1)
helpers.multiPolygon(multiPoly.geometry.coordinates, properties, bbox, 1)
helpers.geometryCollection([pt.geometry], properties, bbox, 1)

// properties
helpers.point(pt.geometry.coordinates, {foo: 'bar'})
helpers.point(pt.geometry.coordinates, {1: 2})
helpers.point(pt.geometry.coordinates, {1: {foo: 'bar'}})

// isNumber -- true
helpers.isNumber(123)
helpers.isNumber(1.23)
helpers.isNumber(-1.23)
helpers.isNumber(-123)
helpers.isNumber('123')
helpers.isNumber(+'123')
helpers.isNumber('1e10000')
helpers.isNumber(1e10000)
helpers.isNumber(Infinity)
helpers.isNumber(-Infinity)

// isNumber -- false
helpers.isNumber(+'ciao')
helpers.isNumber('foo')
helpers.isNumber('10px')
helpers.isNumber(NaN)
helpers.isNumber(undefined)
helpers.isNumber(null)
helpers.isNumber({a: 1})
helpers.isNumber({})
helpers.isNumber([1, 2, 3])
helpers.isNumber([])
helpers.isNumber(helpers.isNumber)
