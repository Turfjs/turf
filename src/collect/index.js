import bboxPolygon from '../bbox-polygon';
import bbox from '../bbox';
import booleanPointInPolygon from '../boolean-point-in-polygon';
import spatialIndex from '../spatial-index';

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
function collect(polygons, points, inProperty, outProperty) {
    const rtree = spatialIndex(6);

    rtree.load(points.features);
    polygons.features.forEach(function (poly) {

        if (!poly.properties) {
            poly.properties = {};
        }
        const searchBbox = bboxPolygon(bbox(poly));
        const potentialPoints = rtree.search(searchBbox);
        const values = [];
        potentialPoints.features.forEach(function (pt) {
            if (booleanPointInPolygon(pt.geometry.coordinates, poly)) {
                values.push(pt.properties[inProperty]);
            }
        });

        poly.properties[outProperty] = values;
    });

    return polygons;
}

export default collect;
