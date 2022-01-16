import pointInPolygon from "@turf/boolean-point-in-polygon";
import { featureCollection, multiPoint } from "@turf/helpers";
import { geomEach, featureEach, coordEach } from "@turf/meta";

/**
 * Finds {@link Points} or {@link MultiPoint} coordinate positions that fall within {@link (Multi)Polygon(s)}.
 *
 * @name pointsWithinPolygon
 * @param {Feature|FeatureCollection<Point|MultiPoint>} points Point(s) or MultiPoint(s) as input search
 * @param {FeatureCollection|Geometry|Feature<Polygon|MultiPolygon>} polygons (Multi)Polygon(s) to check if points are within
 * @returns {FeatureCollection<Point|MultiPoint>} Point(s) or MultiPoint(s) with positions that land within at least one polygon.  The geometry type will match what was passsed in
 * @example
 * var points = turf.points([
 *     [-46.6318, -23.5523],
 *     [-46.6246, -23.5325],
 *     [-46.6062, -23.5513],
 *     [-46.663, -23.554],
 *     [-46.643, -23.557]
 * ]);
 *
 * var searchWithin = turf.polygon([[
 *     [-46.653,-23.543],
 *     [-46.634,-23.5346],
 *     [-46.613,-23.543],
 *     [-46.614,-23.559],
 *     [-46.631,-23.567],
 *     [-46.653,-23.560],
 *     [-46.653,-23.543]
 * ]]);
 *
 * var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);
 *
 * //addToMap
 * var addToMap = [points, searchWithin, ptsWithin]
 * turf.featureEach(ptsWithin, function (currentFeature) {
 *   currentFeature.properties['marker-size'] = 'large';
 *   currentFeature.properties['marker-color'] = '#000';
 * });
 */
function pointsWithinPolygon(points, polygons) {
  var results = [];
  featureEach(points, function (point) {
    var contained = false;
    if (point.geometry.type === "Point") {
      geomEach(polygons, function (polygon) {
        if (pointInPolygon(point, polygon)) contained = true;
      });
      if (contained) {
        results.push(point);
      }
    } else if (point.geometry.type === "MultiPoint") {
      var pointsWithin = [];
      geomEach(polygons, function (polygon) {
        coordEach(point, function (pointCoord) {
          if (pointInPolygon(pointCoord, polygon)) {
            contained = true;
            pointsWithin.push(pointCoord);
          }
        });
      });
      if (contained) {
        results.push(multiPoint(pointsWithin, point.properties || {}));
      }
    } else {
      throw new Error("Input geometry must be a Point or MultiPoint");
    }
  });
  return featureCollection(results);
}

export default pointsWithinPolygon;
