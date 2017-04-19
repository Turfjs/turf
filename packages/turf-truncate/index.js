var coordEach = require('@turf/meta').coordEach;

/**
 * Takes a GeoJSON Feature or FeatureCollection and truncates the precision of the geometry.
 * **Warning:** This module does mutate user input, consider using JSON.parse(JSON.stringify(geojson)) to preserve input integrity.
 *
 * @name truncate
 * @param {FeatureCollection|Feature<any>} geojson any GeoJSON Feature, FeatureCollection, Geometry or GeometryCollection.
 * @param {number} [precision=6] coordinate decimal precision
 * @param {number} [coordinates=2] maximum number of coordinates (primarly used to remove z coordinates)
 * @returns {FeatureCollection|Feature<any>} layer with truncated geometry
 * @example
 * var point = {
 *     "type": "Feature",
 *     "properties": {}
 *     "geometry": {
 *         "type": "Point",
 *         "coordinates": [
 *             70.46923055566859,
 *             58.11088890802906,
 *             1508
 *         ]
 *     }
 * };
 * var truncated = turf.truncate(point);
 *
 * //addToMap
 * var addToMap = [truncated];
 */
module.exports = function (geojson, precision, coordinates) {
    // validation
    if (!geojson) throw new Error('geojson is required');

    // default params
    precision = (precision !== undefined) ? precision : 6;
    coordinates = (coordinates !== undefined) ? coordinates : 2;
    var factor = Math.pow(10, precision);

    // prevent input mutation
    // geojson = JSON.parse(JSON.stringify(geojson));

    coordEach(geojson, function (coords) {
        // Remove extra coordinates (usually elevation coordinates and more)
        if (coords.length > coordinates) coords.splice(coordinates, coords.length);

        // Truncate coordinate decimals
        for (var i = 0; i < coords.length; i++) {
            coords[i] = Math.round(coords[i] * factor) / factor;
        }
    });
    return geojson;
};
