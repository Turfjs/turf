import * as invariant from './'
import {
    point,
    lineString,
    polygon,
    geometryCollection,
    featureCollection,
    Geometry,
    Types,
    GeometryCollection,
    Point,
    LineString,
    Polygon,
    GeometryTypes
} from '@turf/helpers'
import {
    getCoord,
    getCoords,
    geojsonType,
    featureOf,
    collectionOf,
    containsNumber,
    getGeom,
    getType
} from './'

/**
 * Fixtures
 */
const pt = point([0, 0])
const line = lineString([[0, 0], [1, 1]])
const poly = polygon([[[0, 0], [1, 1], [2, 2], [0, 0]]])
const gc = geometryCollection([pt.geometry, line.geometry, poly.geometry])
const fc = featureCollection([pt, line, poly])

/**
 * invariant.getGeom
 */
// invariant.getGeom(fc) // Argument of type 'FeatureCollection<any>' is not assignable to parameter of type
getGeom(gc)
const gcGeom: GeometryCollection  = invariant.getGeom(gc)
const pointGeom: Point = invariant.getGeom(pt)
const lineGeom: LineString = invariant.getGeom(line)
const polyGeom: Polygon = invariant.getGeom(poly)
invariant.getGeom(pt.geometry)

/**
 * invariant.getType
 */
const type: GeometryTypes = invariant.getType(pt)
if (getType(gc) === 'GeometryCollection') console;
if (getType(line) === 'LineString') console;
if (getType(poly) === 'Polygon') console;
if (getType(pt.geometry) === 'Point') console;
if (getType(fc) === 'FeatureCollection') console;
