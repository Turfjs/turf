import * as invariant from './'
import {
    point,
    lineString,
    polygon,
    geometryCollection,
    featureCollection} from '@turf/helpers'
import {
    getCoord,
    getCoords,
    geojsonType,
    featureOf,
    collectionOf,
    containsNumber,
    getGeom,
    getType,
    StringGeomTypes,
    StringTypes} from './'

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
invariant.getGeom(gc)
invariant.getGeom(pt)
invariant.getGeom(line)
invariant.getGeom(poly)
invariant.getGeom(pt.geometry)

/**
 * invariant.getType
 */
const type: StringTypes = invariant.getType(pt)
getType(gc)
invariant.getType(gc)
invariant.getType(line)
invariant.getType(poly)
invariant.getType(pt.geometry)
