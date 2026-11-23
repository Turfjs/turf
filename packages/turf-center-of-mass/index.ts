import { Feature, GeoJsonProperties, Point, Position } from "geojson";
import { convex } from "@turf/convex";
import { centroid } from "@turf/centroid";
import { point } from "@turf/helpers";
import { getType, getCoord, getCoords } from "@turf/invariant";

/**
 * Takes any {@link Feature} or a {@link FeatureCollection} and returns its [center of mass](https://en.wikipedia.org/wiki/Center_of_mass) using this formula: [Centroid of Polygon](https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon).
 *
 * @function
 * @param {GeoJSON} geojson GeoJSON to be centered
 * @param {Object} [options={}] Optional Parameters
 * @param {Object} [options.properties={}] Translate Properties to Feature
 * @returns {Feature<Point>} the center of mass
 * @example
 * var polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
 *
 * var center = turf.centerOfMass(polygon);
 *
 * //addToMap
 * var addToMap = [polygon, center]
 */
function centerOfMass<P extends GeoJsonProperties = GeoJsonProperties>(
  geojson: any,
  options: {
    properties?: P;
  } = {}
): Feature<Point, P> {
  switch (getType(geojson)) {
    case "Point":
      return point(getCoord(geojson), options.properties);
    case "Polygon":
      var coords: Position[][] = getCoords(geojson);

      // First, we neutralize the feature (set it around coordinates [0,0]) to prevent rounding errors
      // We take any point to translate all the points around 0
      var centre = centroid(geojson, { properties: options.properties });
      var translation = centre.geometry.coordinates;
      var sx = 0;
      var sy = 0;
      var sArea = 0;
      var i, pi, pj, xi, xj, yi, yj, a;

      // Each ring is summed on its own. Flattening the rings into a single point list
      // adds an edge joining the outer ring to every hole, and that edge contributes a
      // bogus term to both the total area and the moments. The outer ring counts
      // positively and each hole negatively, matching how @turf/area treats them,
      // whatever the winding happens to be.
      for (var r = 0; r < coords.length; r++) {
        var ring = coords[r];
        var ringArea = 0;
        var ringX = 0;
        var ringY = 0;

        for (i = 0; i < ring.length - 1; i++) {
          // pi is the current point
          pi = ring[i];
          xi = pi[0] - translation[0];
          yi = pi[1] - translation[1];

          // pj is the next point (pi+1)
          pj = ring[i + 1];
          xj = pj[0] - translation[0];
          yj = pj[1] - translation[1];

          // a is the common factor to compute the signed area and the final coordinates
          a = xi * yj - xj * yi;

          // ringArea is the sum used to compute the signed area of this ring
          ringArea += a;

          // ringX and ringY are the sums used to compute this ring's centroid
          ringX += (xi + xj) * a;
          ringY += (yi + yj) * a;
        }

        // A ring's centroid does not depend on its winding, so normalize the ring to a
        // positive area, then let the ring's role in the polygon decide the sign.
        var role = r === 0 ? 1 : -1;
        var winding = ringArea < 0 ? -1 : 1;
        if (ringArea === 0) {
          // A zero-area ring carries no mass, so it cannot move the centroid.
          role = 0;
          winding = 1;
        }

        sArea += role * winding * ringArea;
        sx += role * winding * ringX;
        sy += role * winding * ringY;
      }

      // Shape has no area: fallback on turf.centroid
      if (sArea === 0) {
        return centre;
      } else {
        // Compute the signed area, and factorize 1/6A
        var area = sArea * 0.5;
        var areaFactor = 1 / (6 * area);

        // Compute the final coordinates, adding back the values that have been neutralized
        return point(
          [translation[0] + areaFactor * sx, translation[1] + areaFactor * sy],
          options.properties
        );
      }
    default:
      // Not a polygon: Compute the convex hull and work with that
      var hull = convex(geojson);

      if (hull) return centerOfMass(hull, { properties: options.properties });
      // Hull is empty: fallback on the centroid
      else return centroid(geojson, { properties: options.properties });
  }
}

export { centerOfMass };
export default centerOfMass;
