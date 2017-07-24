/**
 * Returns a cloned copy of the passed GeoJSON Object.
 * By default it duplicates only the standard GeoJSON fields of the object; if `cloneAll` is set to `true` all
 * fields of the Object, thus including 'Foreign Members', will be cloned (3-20x slower).
 *
 * @name clone
 * @param {GeoJSON} geojson GeoJSON Object
 * @param {Boolean} [cloneAll=false] clones entire GeoJSON object, using JSON.parse(JSON.stringify(geojson))
 * @returns {GeoJSON} cloned GeoJSON Object
 * @example
 * var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
 *
 * var lineCloned = turf.clone(line);
 */
module.exports = function (geojson, cloneAll) {
    if (!geojson) throw new Error('geojson is required');
    if (cloneAll && typeof cloneAll !== 'boolean') throw new Error('cloneAll must be a Boolean');

    // Clone entire object (3-20x slower)
    if (cloneAll) return JSON.parse(JSON.stringify(geojson));

    // Clones only GeoJSON fields
    return clone(geojson);
};

/**
 * Clone
 *
 * @private
 * @param {GeoJSON} geojson GeoJSON Feature or Geometry
 * @returns {GeoJSON} cloned Feature
 */
function clone(geojson) {
    // Geometry Object
    if (geojson.coordinates) return cloneGeometry(geojson);

    // Feature
    if (geojson.type === 'Feature') return cloneFeature(geojson);

    // Feature Collection
    if (geojson.type === 'FeatureCollection') return cloneFeatureCollection(geojson);

    // Geometry Collection
    if (geojson.type === 'GeometryCollection') return cloneGeometry(geojson);
}

/**
 * Clone Feature
 *
 * @private
 * @param {Feature<any>} feature GeoJSON Feature
 * @returns {Feature<any>} cloned Feature
 */
function cloneFeature(feature) {
    var cloned = {
        type: 'Feature',
        properties: feature.properties || {},
        geometry: cloneGeometry(feature.geometry)
    };
    if (feature.id) cloned.id = feature.id;
    if (feature.bbox) cloned.bbox = feature.bbox;
    return cloned;
}

/**
 * Clone Feature Collection
 *
 * @private
 * @param {FeatureCollection<any>} geojson GeoJSON Feature Collection
 * @returns {FeatureCollection<any>} cloned Feature Collection
 */
function cloneFeatureCollection(geojson) {
    return {
        type: 'FeatureCollection',
        features: geojson.features.map(function (feature) {
            return cloneFeature(feature);
        })
    };
}

/**
 * Clone Geometry
 *
 * @private
 * @param {Geometry<any>} geometry GeoJSON Geometry
 * @returns {Geometry<any>} cloned Geometry
 */
function cloneGeometry(geometry) {
    if (geometry.type === 'GeometryCollection') {
        return {
            type: 'GeometryCollection',
            geometries: geometry.geometries.map(function (geom) {
                return cloneGeometry(geom);
            })
        };
    }
    return {
        type: geometry.type,
        coordinates: deepSlice(geometry.coordinates)
    };
}

/**
 * Deep Slice coordinates
 *
 * @private
 * @param {Coordinates} coords Coordinates
 * @returns {Coordinates} all coordinates sliced
 */
function deepSlice(coords) {
    if (typeof coords[0] !== 'object') { return coords.slice(); }
    return coords.map(function (coord) {
        return deepSlice(coord);
    });
}
