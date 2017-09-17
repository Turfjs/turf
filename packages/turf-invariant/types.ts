import {point, lineString, polygon, geometryCollection, featureCollection} from '@turf/helpers'
import * as invariant from './'
import { StringTypes, StringGeomTypes } from './'

const pt = point([0, 0])
const line = lineString([[0, 0], [1, 1]])
const poly = polygon([[[0, 0], [1, 1], [2, 2], [0, 0]]])
const gc = geometryCollection([pt.geometry, line.geometry, poly.geometry])
const fc = featureCollection([pt, line, poly])

/**
 * getGeomType
 */
function getGeomType() {
  // invariant.getGeomType(fc) // Argument of type 'FeatureCollection<any>' is not assignable to parameter of type
  const type: StringGeomTypes = invariant.getGeomType(gc)
  invariant.getGeomType(pt)
  invariant.getGeomType(poly)
  invariant.getGeomType(line)
  invariant.getGeomType(pt.geometry)
}

/**
 * getGeom
 */
function getGeom() {
  // invariant.getGeom(fc) // Argument of type 'FeatureCollection<any>' is not assignable to parameter of type
  invariant.getGeom(gc)
  invariant.getGeom(pt)
  invariant.getGeom(line)
  invariant.getGeom(poly)
  invariant.getGeom(pt.geometry)
}


/**
 * getType
 */
function getType() {
  const type: StringTypes = invariant.getType(pt)
  invariant.getType(gc)
  invariant.getType(line)
  invariant.getType(poly)
  invariant.getType(pt.geometry)
}