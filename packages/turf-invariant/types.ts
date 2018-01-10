import * as invariant from './'
import * as helpers from '@turf/helpers'
import {
    Geometry,
    Types,
    GeometryCollection,
    Point,
    LineString,
    Polygon,
    GeometryTypes,
    Position
} from '@turf/helpers'

/**
 * Fixtures
 */
const pt = helpers.point([0, 0])
const line = helpers.lineString([[0, 0], [1, 1]])
const poly = helpers.polygon([[[0, 0], [1, 1], [2, 2], [0, 0]]])
const gc = helpers.geometryCollection([pt.geometry, line.geometry, poly.geometry])
const fc = helpers.featureCollection([pt, line, poly])

/**
 * invariant.getGeom
 */
// invariant.getGeom(fc) // Argument of type 'FeatureCollection<any>' is not assignable to parameter of type
invariant.getGeom(gc)
const gcGeom: GeometryCollection  = invariant.getGeom(gc)
const pointGeom: Point = invariant.getGeom(pt)
const lineGeom: LineString = invariant.getGeom(line)
const polyGeom: Polygon = invariant.getGeom(poly)
invariant.getGeom(pt.geometry)

/**
 * invariant.getType
 */
const type: GeometryTypes = invariant.getType(pt)
invariant.getType(gc) === 'GeometryCollection'
invariant.getType(line) === 'LineString'
invariant.getType(poly) === 'Polygon'
invariant.getType(pt.geometry) === 'Point'
invariant.getType(fc) === 'FeatureCollection'

/**
 * getCoord
 */
invariant.getCoord(pt)
invariant.getCoord(pt.geometry)
invariant.getCoord(pt.geometry.coordinates)
let coordZ: [number, number, number] = [10, 30, 2000]
coordZ = invariant.getCoord(coordZ)

/**
 * getCoords
 */
invariant.getCoords(pt.geometry)[0].toFixed()
invariant.getCoords(pt.geometry.coordinates)[0].toFixed()
invariant.getCoords(pt)[0].toFixed()
invariant.getCoords(line.geometry)[0][0].toFixed()
invariant.getCoords(line.geometry.coordinates)[0][0].toFixed()
invariant.getCoords(line)[0][0].toFixed()
invariant.getCoords(poly)[0][0][0].toFixed()
invariant.getCoords(poly.geometry)[0][0][0].toFixed()
invariant.getCoords(poly.geometry.coordinates)[0][0][0].toFixed()
const lineCoords: Position[] = [[10, 30], [40, 40]]
invariant.getCoords(lineCoords)[0][0].toFixed()