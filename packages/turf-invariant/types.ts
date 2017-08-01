import {point, lineString, polygon, geometryCollection, featureCollection} from '@turf/helpers'
import * as invariant from './'

const pt = point([0, 0])
const line = lineString([[0, 0], [1, 1]])
const poly = polygon([[[0, 0], [1, 1], [2, 2], [0, 0]]])
const gc = geometryCollection([pt.geometry, line.geometry, poly.geometry])
const fc = featureCollection([pt, line, poly])

/**
 * getGeomType
 */
// invariant.getGeomType(fc) // Argument of type 'FeatureCollection<any>' is not assignable to parameter of type
invariant.getGeomType(gc)
invariant.getGeomType(pt)
invariant.getGeomType(poly)
invariant.getGeomType(line)
invariant.getGeomType(pt.geometry)

/**
 * getGeom
 */
// invariant.getGeom(fc) // Argument of type 'FeatureCollection<any>' is not assignable to parameter of type
invariant.getGeom(gc)
invariant.getGeom(pt)
invariant.getGeom(line)
invariant.getGeom(poly)
invariant.getGeom(pt.geometry)
