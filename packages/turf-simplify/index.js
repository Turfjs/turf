var simplify = require('simplify-js');

// supported GeoJSON geometries, used to check whether to wrap in simpleFeature()
var supportedTypes = ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];

/**
 * Takes a {@link LineString} or {@link Polygon} and returns a simplified version. Internally uses [simplify-js](http://mourner.github.io/simplify-js/) to perform simplification.
 *
 * @name simplify
 * @param {Feature<(LineString|Polygon|MultiLineString|MultiPolygon)>|FeatureCollection|GeometryCollection} feature feature to be simplified
 * @param {number} tolerance simplification tolerance
 * @param {boolean} highQuality whether or not to spend more time to create
 * a higher-quality simplification with a different algorithm
 * @return {Feature<(LineString|Polygon|MultiLineString|MultiPolygon)>|FeatureCollection|GeometryCollection} a simplified feature
 * @example
  * var feature = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Polygon",
 *     "coordinates": [[
 *       [-70.603637, -33.399918],
 *       [-70.614624, -33.395332],
 *       [-70.639343, -33.392466],
 *       [-70.659942, -33.394759],
 *       [-70.683975, -33.404504],
 *       [-70.697021, -33.419406],
 *       [-70.701141, -33.434306],
 *       [-70.700454, -33.446339],
 *       [-70.694274, -33.458369],
 *       [-70.682601, -33.465816],
 *       [-70.668869, -33.472117],
 *       [-70.646209, -33.473835],
 *       [-70.624923, -33.472117],
 *       [-70.609817, -33.468107],
 *       [-70.595397, -33.458369],
 *       [-70.587158, -33.442901],
 *       [-70.587158, -33.426283],
 *       [-70.590591, -33.414248],
 *       [-70.594711, -33.406224],
 *       [-70.603637, -33.399918]
 *     ]]
 *   }
 * };

 * var tolerance = 0.01;
 *
 * var simplified = turf.simplify(
 *  feature, tolerance, false);
 *
 * //=feature
 *
 * //=simplified
 */
module.exports = function (feature, tolerance, highQuality) {
    if (feature.type === 'Feature') {
        return simpleFeature(
            simplifyHelper(feature, tolerance, highQuality),
            feature.properties);
    } else if (feature.type === 'FeatureCollection') {
        return {
            type: 'FeatureCollection',
            features: feature.features.map(function (f) {
                var simplified = simplifyHelper(f, tolerance, highQuality);

                // we create simpleFeature here because it doesn't apply to GeometryCollection
                // so we can't create it at simplifyHelper()
                if (supportedTypes.indexOf(simplified.type) > -1) {
                    return simpleFeature(simplified, f.properties);
                } else {
                    return simplified;
                }
            })
        };
    } else if (feature.type === 'GeometryCollection') {
        return {
            type: 'GeometryCollection',
            geometries: feature.geometries.map(function (g) {
                if (supportedTypes.indexOf(g.type) > -1) {
                    return simplifyHelper({
                        type: 'Feature',
                        geometry: g
                    }, tolerance, highQuality);
                }
                return g;
            })
        };
    } else {
        return feature;
    }
};


function simplifyHelper(feature, tolerance, highQuality) {
    if (feature.geometry.type === 'LineString') {
        return {
            type: 'LineString',
            coordinates: simplifyLine(feature.geometry.coordinates, tolerance, highQuality)
        };
    } else if (feature.geometry.type === 'MultiLineString') {
        return {
            type: 'MultiLineString',
            coordinates: feature.geometry.coordinates.map(function (lines) {
                return simplifyLine(lines, tolerance, highQuality);
            })
        };
    } else if (feature.geometry.type === 'Polygon') {
        return {
            type: 'Polygon',
            coordinates: simplifyPolygon(feature.geometry.coordinates, tolerance, highQuality)
        };
    } else if (feature.geometry.type === 'MultiPolygon') {
        return {
            type: 'MultiPolygon',
            coordinates: feature.geometry.coordinates.map(function (rings) {
                return simplifyPolygon(rings, tolerance, highQuality);
            })
        };
    } else {
        // unsupported geometry type supplied
        return feature;
    }
}

/*
* returns true if ring's first coordinate is the same as its last
*/
function checkValidity(ring) {
    if (ring.length < 3) {
        return false;
    //if the last point is the same as the first, it's not a triangle
    } else if (ring.length === 3 &&
      ((ring[2][0] === ring[0][0]) && (ring[2][1] === ring[0][1]))) {
        return false;
    } else {
        return true;
    }
}

function simpleFeature(geom, properties) {
    return {
        type: 'Feature',
        geometry: geom,
        properties: properties
    };
}

function simplifyLine(coordinates, tolerance, highQuality) {
    return simplify(coordinates.map(function (coord) {
        return {x: coord[0], y: coord[1]};
    }), tolerance, highQuality).map(function (coords) {
        return [coords.x, coords.y];
    });
}

function simplifyPolygon(coordinates, tolerance, highQuality) {
    return coordinates.map(function (ring) {
        var pts = ring.map(function (coord) {
            return {x: coord[0], y: coord[1]};
        });
        if (pts.length < 4) {
            throw new Error('Invalid polygon');
        }
        var simpleRing = simplify(pts, tolerance, highQuality).map(function (coords) {
            return [coords.x, coords.y];
        });
        //remove 1 percent of tolerance until enough points to make a triangle
        while (!checkValidity(simpleRing)) {
            tolerance -= tolerance * 0.01;
            simpleRing = simplify(pts, tolerance, highQuality).map(function (coords) {
                return [coords.x, coords.y];
            });
        }
        if (
            (simpleRing[simpleRing.length - 1][0] !== simpleRing[0][0]) ||
                (simpleRing[simpleRing.length - 1][1] !== simpleRing[0][1])) {
            simpleRing.push(simpleRing[0]);
        }
        return simpleRing;
    });
}
