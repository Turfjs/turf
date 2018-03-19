import * as martinez from 'martinez-polygon-clipping';
import { getGeom } from '@turf/invariant';
import { multiPolygon, polygon, Feature, Polygon, MultiPolygon, Properties } from '@turf/helpers';

/**
 * Takes two {@link Polygon|polygon} or {@link MultiPolygon|multi-polygon} geometries and finds their polygonal intersection. If they don't intersect, returns null.
 *
 * @name intersect
 * @param {Feature<Polygon | MultiPolygon>} poly1 the first polygon or multipolygon
 * @param {Feature<Polygon | MultiPolygon>} poly2 the second polygon or multipolygon
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] Translate GeoJSON Properties to Feature
 * @returns {Feature|null} returns a feature representing the area they share (either a {@link Polygon} or {@link MultiPolygon}). If they do not share any area, returns `null`.
 * @example
 * var poly1 = turf.polygon([[
 *   [-122.801742, 45.48565],
 *   [-122.801742, 45.60491],
 *   [-122.584762, 45.60491],
 *   [-122.584762, 45.48565],
 *   [-122.801742, 45.48565]
 * ]]);
 *
 * var poly2 = turf.polygon([[
 *   [-122.520217, 45.535693],
 *   [-122.64038, 45.553967],
 *   [-122.720031, 45.526554],
 *   [-122.669906, 45.507309],
 *   [-122.723464, 45.446643],
 *   [-122.532577, 45.408574],
 *   [-122.487258, 45.477466],
 *   [-122.520217, 45.535693]
 * ]]);
 *
 * var intersection = turf.intersect(poly1, poly2);
 *
 * //addToMap
 * var addToMap = [poly1, poly2, intersection];
 */
function intersect<P = Properties>(
    poly1: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
    poly2: Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon,
    options: {
        properties?: P,
    } = {}
): Feature<Polygon | MultiPolygon, P> | null {
    const geom1 = getGeom(poly1);
    const geom2 = getGeom(poly2);

    if (geom1.type === 'Polygon' && geom2.type === 'Polygon') {
      const intersection: any = martinez.intersection(geom1.coordinates, geom2.coordinates);

      if (intersection === null || intersection.length === 0) return null;
      if (intersection.length === 1) {
          const start = intersection[0][0][0];
          const end = intersection[0][0][intersection[0][0].length - 1];
          if (start[0] === end[0] && start[1] === end[1]) return polygon(intersection[0], options.properties);
          return null;
      }
      return multiPolygon(intersection, options.properties);

    } else if (geom1.type === 'MultiPolygon') {
      let resultCoords = [];

      // iterate through the polygon and run intersect with each part, adding to the resultCoords.
      for (let i = 0; i < geom1.coordinates.length; i++) {
        const subGeom = getGeom(polygon(geom1.coordinates[i]));
        const subIntersection = intersect(subGeom, geom2);

        if (subIntersection) {
          const subIntGeom = getGeom(subIntersection);

          if (subIntGeom.type === 'Polygon') resultCoords.push(subIntGeom.coordinates);
          else if (subIntGeom.type === 'MultiPolygon') resultCoords = resultCoords.concat(subIntGeom.coordinates);
          else throw new Error('intersection is invalid');
        }
      }

      // Make a polygon with the result
      if (resultCoords.length === 0) return null;
      if (resultCoords.length === 1) return polygon(resultCoords[0], options.properties);
      else return multiPolygon(resultCoords, options.properties);

    } else if (geom2.type === 'MultiPolygon') {
      // geom1 is a polygon and geom2 a multiPolygon,
      // put the multiPolygon first and fallback to the previous case.
      return intersect(geom2, geom1);

    } else {
      // handle invalid geometry types
      throw new Error('poly1 and poly2 must be either polygons or multiPolygons');
    }
}

export default intersect;
