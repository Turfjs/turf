import {polygon, point} from '@turf/helpers';
import * as rotate from './'

const pt = point([15, 15]);
const poly = polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);

// Does not mutate Geometry type
const rotatedPoly: GeoJSON.Feature<GeoJSON.Polygon> = rotate(poly, 100, pt);

// Different Geometry Inputs
rotate(poly, 100, pt);
rotate(poly, 100, pt.geometry);
rotate(poly.geometry, 100, pt.geometry.coordinates);

// xRotation & yRotation
rotate(poly, 100, pt, 40, 20);