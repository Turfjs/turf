import {polygon, point, featureCollection, geometryCollection} from '@turf/helpers';
import * as rotate from './'

const pt = point([15, 15]);
const poly = polygon([[[0,29],[3.5,29],[2.5,32],[0,29]]]);

// Does not mutate Geometry type
const rotatedPoly: GeoJSON.Feature<GeoJSON.Polygon> = rotate(poly, 100, pt);
const rotatedFCPoly: GeoJSON.FeatureCollection<GeoJSON.Polygon> = rotate(featureCollection([poly]), 100, pt);

// Different Geometry Inputs
rotate(poly, 100, pt);
rotate(poly, 100, pt.geometry);
rotate(poly.geometry, 100, pt.geometry.coordinates);
rotate(featureCollection([poly]), 100, pt.geometry);
rotate(featureCollection([poly, pt]), 100, pt);
rotate(geometryCollection([poly.geometry]).geometry, 100, pt.geometry);
rotate(geometryCollection([poly.geometry]), 100, pt.geometry);
rotate(geometryCollection([poly.geometry, pt.geometry]), 100, pt);

// Allow mutating
rotate(poly, 100, pt, true);