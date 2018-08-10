import union from '../union';
import { polygon, featureCollection } from '../helpers';

/**
 * Takes any type of {@link Polygon|polygon} and an optional mask and returns a {@link Polygon|polygon} exterior ring with holes.
 *
 * @name mask
 * @param {FeatureCollection|Feature<Polygon|MultiPolygon>} polygon GeoJSON Polygon or a Feature Collection of polygons, used as interior rings or holes.
 * @param {FeatureCollection|Feature<Polygon>} [mask] GeoJSON Polygon used as the exterior ring (if undefined, the world extent is used)
 * @returns {Feature<Polygon>} Masked Polygon (exterior ring with holes).
 * @example
 * var polygon = turf.polygon([[[112, -21], [116, -36], [146, -39], [153, -24], [133, -10], [112, -21]]]);
 * var mask = turf.polygon([[[90, -55], [170, -55], [170, 10], [90, 10], [90, -55]]]);
 *
 * var masked = turf.mask(polygon, mask);
 *
 * //addToMap
 * var addToMap = [masked]
 */
function mask(polygon, mask) {
    // Define mask
    var maskPolygon = createMask(mask);

    var polygonOuters = null;
    if (polygon.type === 'FeatureCollection') polygonOuters = union(polygon);
    else polygonOuters = union(featureCollection([polygon]));

    polygonOuters.geometry.coordinates.forEach(function (contour) {
        maskPolygon.geometry.coordinates.push(contour[0]);
    });

    return maskPolygon;
}

/**
 * Create Mask Coordinates
 *
 * @private
 * @param {Feature<Polygon>} [mask] default to world if undefined
 * @returns {Feature<Polygon>} mask coordinate
 */
function createMask(mask) {
    var world = [[[180, 90], [-180, 90], [-180, -90], [180, -90], [180, 90]]];
    var coordinates = mask && mask.geometry.coordinates || world;
    return polygon(coordinates);
}

export default mask;

