import clone from '../clone';
// import turfBbox from '../bbox';
// import { BufferOp, GeoJSONReader, GeoJSONWriter } from 'turf-jsts';
// import { toWgs84, toMercator } from '../projection';
import Offset from 'polygon-offset';
import * as martinez from 'martinez-polygon-clipping';
import centerOfMass from '../center-of-mass';
import { geomEach, coordEach, featureEach, flattenEach } from '../meta';
// import { geoTransverseMercator } from 'd3-geo';
import { lengthToDegrees, featureCollection, radiansToLength,lengthToRadians, polygon, multiPolygon, degreesToRadians, radiansToDegrees } from '../helpers';

/**
 * Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.
 *
 * When using a negative radius, the resulting geometry may be invalid if
 * it's too small compared to the radius magnitude. If the input is a
 * FeatureCollection, only valid members will be returned in the output
 * FeatureCollection - i.e., the output collection may have fewer members than
 * the input, or even be empty.
 *
 * @name buffer
 * @param {FeatureCollection|Geometry|Feature<any>} geojson input to be buffered
 * @param {number} radius distance to draw the buffer (negative values are allowed)
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units="kilometers"] any of the options supported by turf units
 * @param {number} [options.steps=64] number of steps
 * @returns {FeatureCollection|Feature<Polygon|MultiPolygon>|undefined} buffered features
 * @example
 * var point = turf.point([-90.548630, 14.616599]);
 * var buffered = turf.buffer(point, 500, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [point, buffered]
 */
function buffer(geojson, radius, options) {

    // Optional params
    options = options || {};
    var units = options.units || 'kilometers';
    var steps = options.steps || 64;

    // validation
    if (!geojson) throw new Error('geojson is required');
    if (typeof options !== 'object') throw new Error('options must be an object');
    if (typeof steps !== 'number') throw new Error('steps must be an number');

    // Allow negative buffers ("erosion") or zero-sized buffers ("repair geometry")
    if (radius === undefined) throw new Error('radius is required');
    if (steps <= 0) throw new Error('steps must be greater than 0');

    var distance = radiansToLength(lengthToRadians(radius, units), 'meters');

    var results = [];

    switch (geojson.type) {
    case 'GeometryCollection':
        geomEach(geojson, function (geometry) {
            results.push(bufferFeature(geometry, distance, steps));
        });
        return featureCollection(results);
    case 'FeatureCollection':
        featureEach(geojson, function (feature) {
            results.push(bufferFeature(feature, distance, steps));
        });
        return featureCollection(results);
    }
    return bufferFeature(geojson, distance, steps);
}

/**
 * Buffer single Feature/Geometry
 *
 * @private
 * @param {Feature<any>} geojson input to be buffered
 * @param {number} radius distance to draw the buffer
 * @param {number} [steps=64] number of steps
 * @returns {Feature<Polygon|MultiPolygon>} buffered feature
 */
function bufferFeature(geojson, radius, steps) {
    var properties = geojson.properties || {};
    var geometry = (geojson.type === 'Feature') ? clone(geojson.geometry) : clone(geojson);

    var centroid = centerOfMass(geometry);
    var utmZone = checkUtmZone(centroid.geometry);
    reprojectFeature(geometry, utmZone, true);

    var offset = new Offset();
    var result = null;
    if (geometry.type === 'LineString') {
        result = offset.data(geometry.coordinates).arcSegments(steps).offsetLine(radius);
    } else if (geometry.type === 'MultiLineString') {
        result = offset.data(geometry.coordinates).arcSegments(steps).offsetLines(radius);
    } else if (geometry.type === 'Point') {
        result = offset.data(geometry.coordinates).arcSegments(steps).offset(radius);
    } else if (geometry.type === 'MultiPoint') {
        result = [];
        flattenEach(geometry, function (p) {
            if (result.length === 0) result.push(offset.data(p.geometry.coordinates).arcSegments(steps).offset(radius));
            else result = martinez.union(offset.data(p.geometry.coordinates).arcSegments(steps).offset(radius), result);
        });
    } else if (geometry.type === 'Polygon') {
        result = offset.data(geometry.coordinates).arcSegments(steps).offset(radius);
    } else if (geometry.type === 'MultiPolygon') {
        result = [];
        flattenEach(geometry, function (p) {
            if (result.length === 0) result.push(offset.data(p.geometry.coordinates).arcSegments(steps).offset(radius));
            else result = martinez.union(result, offset.data(p.geometry.coordinates).arcSegments(steps).offset(radius));
        });
    }

    result = JSON.parse(JSON.stringify(result))
    if (geometry.type === 'MultiPoint' || geometry.type === 'MultiPolygon') {
        let out = multiPolygon(result, properties);
        reprojectFeature(out, utmZone, false);
        return out;
    }

    let out = polygon(result, properties);
    reprojectFeature(out, utmZone, false);
    return out;

}

export default buffer;

function reprojectFeature(feature, utmZone, toUtm) {
    coordEach(feature, function (coord, coordIndex) { //eslint-disable-line
        var blah = toUtm ? convertCoordToUtm(coord[0], coord[1], utmZone) : convertUtmToLatLon(coord[0], coord[1], utmZone);
        coord.length = 0;
        coord.push(blah[0], blah[1]);
    }, false);
}

function checkUtmZone(centerPoint) {

    const lat = centerPoint.coordinates[1];
    const lon = centerPoint.coordinates[0];
    let zoneNumber = Math.floor((lon + 180) / 6) + 1;
    let hemisphere = 'N';

    if (lon === 180) zoneNumber = 60;
    if (lat < 0.0) hemisphere = 'S';

    if (lat >= 56.0 && lat < 64.0 && lon >= 3.0 && lon < 12.0) zoneNumber = 32;

    return {zoneNumber, hemisphere};
}

function convertCoordToUtm(lon, lat, zone) {

    let falseEasting = 500e3;
    let falseNorthing = 10000e3;
    let λ0 = degreesToRadians(((zone.zoneNumber - 1) * 6 - 180 + 3));

    let mgrsLatBands = 'CDEFGHJKLMNPQRSTUVWXX'; // X is repeated for 80-84°N
    let latBand = mgrsLatBands.charAt(Math.floor(lat / 8 + 10));

    // adjust zone & central meridian for Norway
    if (zone === 31 && latBand === 'V' && lon >= 3) { zone++; degreesToRadians(λ0 += 6); }
    // adjust zone & central meridian for Svalbard
    if (zone === 32 && latBand === 'X' && lon <  9) { zone--; degreesToRadians(λ0 -= 6); }
    if (zone === 32 && latBand === 'X' && lon >= 9) { zone++; degreesToRadians(λ0 += 6); }
    if (zone === 34 && latBand === 'X' && lon < 21) { zone--; degreesToRadians(λ0 -= 6); }
    if (zone === 34 && latBand === 'X' && lon >= 21) { zone++; degreesToRadians(λ0 += 6); }
    if (zone === 36 && latBand === 'X' && lon < 33) { zone--; degreesToRadians(λ0 -= 6); }
    if (zone === 36 && latBand === 'X' && lon >= 33) { zone++; degreesToRadians(λ0 += 6); }

    var φ = degreesToRadians(lat);      // latitude ± from equator
    var λ = degreesToRadians(lon) - λ0; // longitude ± from central meridian

    let a = 6378137;
    let f = 1 / 298.257223563;
    // WGS 84: a = 6378137, b = 6356752.314245, f = 1/298.257223563;

    let k0 = 0.9996; // UTM scale on the central meridian

    // ---- easting, northing: Karney 2011 Eq 7-14, 29, 35:

    let e = Math.sqrt(f * (2 - f)); // eccentricity
    let n = f / (2 - f);        // 3rd flattening
    let n2 = n * n, n3 = n * n2, n4 = n * n3, n5 = n * n4, n6 = n * n5; // TODO: compare Horner-form accuracy?

    let cosλ = Math.cos(λ), sinλ = Math.sin(λ);

    let τ = Math.tan(φ); // τ ≡ tanφ, τʹ ≡ tanφʹ; prime (ʹ) indicates angles on the conformal sphere
    let σ = Math.sinh(e * Math.atanh(e * τ / Math.sqrt(1 + τ * τ)));

    let τʹ = τ * Math.sqrt(1 + σ * σ) - σ * Math.sqrt(1 + τ * τ);

    let ξʹ = Math.atan2(τʹ, cosλ);
    let ηʹ = Math.asinh(sinλ / Math.sqrt(τʹ * τʹ + cosλ * cosλ));

    let A = a / (1 + n) * (1 + 1 / 4 * n2 + 1 / 64 * n4 + 1 / 256 * n6); // 2πA is the circumference of a meridian

    let α = [null, // note α is one-based array (6th order Krüger expressions)
        1 / 2 * n - 2 / 3 * n2 + 5 / 16 * n3 +   41 / 180 * n4 -     127 / 288 * n5 +      7891 / 37800 * n6,
        13 / 48 * n2 -  3 / 5 * n3 + 557 / 1440 * n4 +     281 / 630 * n5 - 1983433 / 1935360 * n6,
        61 / 240 * n3 -  103 / 140 * n4 + 15061 / 26880 * n5 +   167603 / 181440 * n6,
        49561 / 161280 * n4 -     179 / 168 * n5 + 6601661 / 7257600 * n6,
        34729 / 80640 * n5 - 3418889 / 1995840 * n6,
        212378941 / 319334400 * n6];

    let ξ = ξʹ;
    for (let j = 1; j <= 6; j++) ξ += α[j] * Math.sin(2 * j * ξʹ) * Math.cosh(2 * j * ηʹ);

    let η = ηʹ;
    for (let j = 1; j <= 6; j++) η += α[j] * Math.cos(2 * j * ξʹ) * Math.sinh(2 * j * ηʹ);

    let x = k0 * A * η;
    let y = k0 * A * ξ;

    x = x + falseEasting;
    if (y < 0) y = y + falseNorthing;

    return [y, x];
}

function convertUtmToLatLon(y, x, zone) {
    var z = zone.zoneNumber;
    var h = zone.hemisphere;

    var falseEasting = 500e3, falseNorthing = 10000e3;

    var a = 6378137, f = 1 / 298.257223563;

    var k0 = 0.9996; // UTM scale on the central meridian

    x = x - falseEasting;               // make x ± relative to central meridian
    y = h === 'S' ? y - falseNorthing : y; // make y ± relative to equator

    // ---- from Karney 2011 Eq 15-22, 36:

    var e = Math.sqrt(f * (2 - f)); // eccentricity
    var n = f / (2 - f);        // 3rd flattening
    var n2 = n * n, n3 = n * n2, n4 = n * n3, n5 = n * n4, n6 = n * n5;

    var A = a / (1 + n) * (1 + 1 / 4 * n2 + 1 / 64 * n4 + 1 / 256 * n6); // 2πA is the circumference of a meridian

    var η = x / (k0 * A);
    var ξ = y / (k0 * A);

    var β = [null, // note β is one-based array (6th order Krüger expressions)
        1 / 2 * n - 2 / 3 * n2 + 37 / 96 * n3 -    1 / 360 * n4 -   81 / 512 * n5 +    96199 / 604800 * n6,
               1 / 48 * n2 +  1 / 15 * n3 - 437 / 1440 * n4 +   46 / 105 * n5 - 1118711 / 3870720 * n6,
                        17 / 480 * n3 -   37 / 840 * n4 - 209 / 4480 * n5 +      5569 / 90720 * n6,
                                 4397 / 161280 * n4 -   11 / 504 * n5 -  830251 / 7257600 * n6,
                                               4583 / 161280 * n5 -  108847 / 3991680 * n6,
                                                             20648693 / 638668800 * n6 ];

    var ξʹ = ξ;
    for (var j = 1; j <= 6; j++) ξʹ -= β[j] * Math.sin(2 * j * ξ) * Math.cosh(2 * j * η);

    var ηʹ = η;
    for (var j = 1; j <= 6; j++) ηʹ -= β[j] * Math.cos(2 * j * ξ) * Math.sinh(2 * j * η);

    var sinhηʹ = Math.sinh(ηʹ);
    var sinξʹ = Math.sin(ξʹ), cosξʹ = Math.cos(ξʹ);

    var τʹ = sinξʹ / Math.sqrt(sinhηʹ * sinhηʹ + cosξʹ * cosξʹ);

    var τi = τʹ;
    do {
        var σi = Math.sinh(e * Math.atanh(e * τi / Math.sqrt(1 + τi * τi)));
        var τiʹ = τi * Math.sqrt(1 + σi * σi) - σi * Math.sqrt(1 + τi * τi);
        var δτi = (τʹ - τiʹ) / Math.sqrt(1 + τiʹ * τiʹ)
            * (1 + (1 - e * e) * τi * τi) / ((1 - e * e) * Math.sqrt(1 + τi * τi));
        τi += δτi;
    } while (Math.abs(δτi) > 1e-12); // using IEEE 754 δτi -> 0 after 2-3 iterations
    // note relatively large convergence test as δτi toggles on ±1.12e-16 for eg 31 N 400000 5000000
    var τ = τi;

    var φ = Math.atan(τ);

    var λ = Math.atan2(sinhηʹ, cosξʹ);

    // ---- convergence: Karney 2011 Eq 26, 27

    var p = 1;
    for (var j = 1; j <= 6; j++) p -= 2 * j * β[j] * Math.cos(2 * j * ξ) * Math.cosh(2 * j * η);
    var q = 0;
    for (var j = 1; j <= 6; j++) q += 2 * j * β[j] * Math.sin(2 * j * ξ) * Math.sinh(2 * j * η);

    var γʹ = Math.atan(Math.tan(ξʹ) * Math.tanh(ηʹ));
    var γʺ = Math.atan2(q, p);

    var γ = γʹ + γʺ;

    // ---- scale: Karney 2011 Eq 28

    var sinφ = Math.sin(φ);
    var kʹ = Math.sqrt(1 - e * e * sinφ * sinφ) * Math.sqrt(1 + τ * τ) * Math.sqrt(sinhηʹ * sinhηʹ + cosξʹ * cosξʹ);
    var kʺ = A / a / Math.sqrt(p * p + q * q);

    var k = k0 * kʹ * kʺ;

    // ------------

    var λ0 = degreesToRadians((z - 1) * 6 - 180 + 3); // longitude of central meridian
    λ += λ0; // move λ from zonal to global coordinates

    // round to reasonable precision
    var lat = radiansToDegrees(φ); // nm precision (1nm = 10^-11°)
    var lon = radiansToDegrees(λ); // (strictly lat rounding should be φ⋅cosφ!)

    return [lon, lat];
}
