// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html
var jsts = require('jsts');
var area = require('@turf/area');
var feature = require('@turf/helpers').feature;
var getGeom = require('@turf/invariant').getGeom;
var flattenEach = require('@turf/meta').flattenEach;

/**
 * Finds the difference between two {@link Polygon|polygons} by clipping the second polygon from the first.
 *
 * @name difference
 * @param {Feature<Polygon|MultiPolygon>} polygon1 input Polygon feature
 * @param {Feature<Polygon|MultiPolygon>} polygon2 Polygon feature to difference from polygon1
 * @returns {Feature<Polygon|MultiPolygon>|undefined} a Polygon or MultiPolygon feature showing the area of `polygon1` excluding the area of `polygon2` (if empty returns `undefined`)
 * @example
 * var polygon1 = turf.polygon([[
 *   [128, -26],
 *   [141, -26],
 *   [141, -21],
 *   [128, -21],
 *   [128, -26]
 * ]], {
 *   "fill": "#F00",
 *   "fill-opacity": 0.1
 * });
 * var polygon2 = turf.polygon([[
 *   [126, -28],
 *   [140, -28],
 *   [140, -20],
 *   [126, -20],
 *   [126, -28]
 * ]], {
 *   "fill": "#00F",
 *   "fill-opacity": 0.1
 * });
 *
 * var difference = turf.difference(polygon1, polygon2);
 *
 * //addToMap
 * var addToMap = [polygon1, polygon2, difference];
 */
module.exports = function (polygon1, polygon2) {
    var geom1 = getGeom(polygon1);
    var geom2 = getGeom(polygon2);
    var properties = polygon1.properties || {};

    // Issue #721 - JSTS can't handle empty polygons
    geom1 = removeEmptyPolygon(geom1);
    geom2 = removeEmptyPolygon(geom2);
    if (!geom1) return undefined;
    if (!geom2) return feature(geom1, properties);

    // JSTS difference operation
    var reader = new jsts.io.GeoJSONReader();
    var a = reader.read(geom1);
    var b = reader.read(geom2);
    var differenced = a.difference(b);
    if (differenced.isEmpty()) return undefined;
    var writer = new jsts.io.GeoJSONWriter();
    var geom = writer.write(differenced);

    return feature(geom, properties);
};

/**
 * Detect Empty Polygon
 *
 * @param {Geometry<Polygon|MultiPolygon>} geom Geometry Object
 * @returns {Geometry<Polygon|MultiPolygon>|undefined} removed any polygons with no areas
 */
function removeEmptyPolygon(geom) {
    switch (geom.type) {
    case 'Polygon':
        if (area(geom) > 1) return geom;
        return undefined;
    case 'MultiPolygon':
        var coordinates = [];
        flattenEach(geom, function (feature) {
            if (area(feature) > 1) coordinates.push(feature.geometry.coordinates);
        });
        if (coordinates.length) return {type: 'MultiPolygon', coordinates: coordinates};
    }
}
