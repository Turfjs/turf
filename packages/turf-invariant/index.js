/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array of numbers
 *
 * @param {Array<any>|Geometry|Feature<any>} obj any value
 * @returns {Array<any>} coordinates
 */
function getCoord(obj) {
    if (obj === undefined) throw new Error('No obj passed');

    // Array of numbers
    if (obj.length) return obj;

    // Geometry Object
    if (obj.coordinates) return obj.coordinates;

    // Feature
    var geometry = obj.geometry;
    if (geometry && geometry.coordinates) return geometry.coordinates;

    throw new Error('No valid coordinates');
}

/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @alias geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (type === undefined || name === undefined) throw new Error('type and name required');

    if (value === undefined || value.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.type);
    }
}

/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @alias featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(feature, type, name) {
    if (name === undefined) throw new Error('.featureOf() requires a name');
    if (feature === undefined || feature.type !== 'Feature' || feature.geometry === undefined) {
        throw new Error('Invalid input to ' + name + ', Feature with geometry required');
    }
    if (feature.geometry === undefined || feature.geometry.type !== type) {
        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
    }
}

/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @alias collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(featureCollection, type, name) {
    if (name === undefined) throw new Error('.collectionOf() requires a name');
    if (featureCollection === undefined || featureCollection.type !== 'FeatureCollection') {
        throw new Error('Invalid input to ' + name + ', FeatureCollection required');
    }
    for (var i = 0; i < featureCollection.features.length; i++) {
        var feature = featureCollection.features[i];
        if (feature === undefined || feature.type !== 'Feature' || feature.geometry === undefined) {
            throw new Error('Invalid input to ' + name + ', Feature with geometry required');
        }
        if (feature.geometry === undefined || feature.geometry.type !== type) {
            throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
        }
    }
}

module.exports.geojsonType = geojsonType;
module.exports.collectionOf = collectionOf;
module.exports.featureOf = featureOf;
module.exports.getCoord = getCoord;
