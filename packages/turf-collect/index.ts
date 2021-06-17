import turfbbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import rbush from "rbush";
import { FeatureCollection, Polygon, Point } from "@turf/helpers";

interface Entry {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  property: any;
}

/**
 * Merges a specified property from a FeatureCollection of points into a
 * FeatureCollection of polygons. Given an `inProperty` on points and an `outProperty`
 * for polygons, this finds every point that lies within each polygon, collects the
 * `inProperty` values from those points, and adds them as an array to `outProperty`
 * on the polygon.
 *
 * @name collect
 * @param {FeatureCollection<Polygon>} polygons polygons with values on which to aggregate
 * @param {FeatureCollection<Point>} points points to be aggregated
 * @param {string} inProperty property to be nested from
 * @param {string} outProperty property to be nested into
 * @returns {FeatureCollection<Polygon>} polygons with properties listed based on `outField`
 * @example
 * var poly1 = turf.polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]);
 * var poly2 = turf.polygon([[[10,0],[20,10],[20,20],[20,0],[10,0]]]);
 * var polyFC = turf.featureCollection([poly1, poly2]);
 * var pt1 = turf.point([5,5], {population: 200});
 * var pt2 = turf.point([1,3], {population: 600});
 * var pt3 = turf.point([14,2], {population: 100});
 * var pt4 = turf.point([13,1], {population: 200});
 * var pt5 = turf.point([19,7], {population: 300});
 * var pointFC = turf.featureCollection([pt1, pt2, pt3, pt4, pt5]);
 * var collected = turf.collect(polyFC, pointFC, 'population', 'values');
 * var values = collected.features[0].properties.values
 * //=values => [200, 600]
 *
 * //addToMap
 * var addToMap = [pointFC, collected]
 */
function collect(
  polygons: FeatureCollection<Polygon>,
  points: FeatureCollection<Point>,
  inProperty: string,
  outProperty: string
): FeatureCollection<Polygon> {
  var rtree = rbush<Entry>(6);

  var treeItems = points.features.map(function (item) {
    return {
      minX: item.geometry.coordinates[0],
      minY: item.geometry.coordinates[1],
      maxX: item.geometry.coordinates[0],
      maxY: item.geometry.coordinates[1],
      property: item.properties?.[inProperty],
    };
  });

  rtree.load(treeItems);
  polygons.features.forEach(function (poly) {
    if (!poly.properties) {
      poly.properties = {};
    }
    var bbox = turfbbox(poly);
    var potentialPoints = rtree.search({
      minX: bbox[0],
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3],
    });
    var values: any[] = [];
    potentialPoints.forEach(function (pt) {
      if (booleanPointInPolygon([pt.minX, pt.minY], poly)) {
        values.push(pt.property);
      }
    });

    poly.properties[outProperty] = values;
  });

  return polygons;
}

export default collect;
