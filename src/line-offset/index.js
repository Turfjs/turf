import { flattenEach, coordEach } from '../meta';
import { getCoords, getType } from '../invariant';
import { isObject, lineString, multiLineString, convertLength, degreesToRadians, radiansToDegrees } from '../helpers';
import intersection from './lib/intersection';
import centerOfMass from '../center-of-mass';

/**
 * Takes a {@link LineString|line} and returns a {@link LineString|line} at offset by the specified distance.
 *
 * @name lineOffset
 * @param {Geometry|Feature<LineString|MultiLineString>} geojson input GeoJSON
 * @param {number} distance distance to offset the line (can be of negative value)
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, kilometers, inches, yards, meters
 * @returns {Feature<LineString|MultiLineString>} Line offset from the input line
 * @example
 * var line = turf.lineString([[-83, 30], [-84, 36], [-78, 41]], { "stroke": "#F00" });
 *
 * var offsetLine = turf.lineOffset(line, 2, {units: 'miles'});
 *
 * //addToMap
 * var addToMap = [offsetLine, line]
 * offsetLine.properties.stroke = "#00F"
 */
function lineOffset(geojson, distance, options) {
    // Optional parameters
    options = options || {};
    if (!isObject(options)) throw new Error('options is invalid');
    var units = options.units ? options.units : 'kilometers';

    // Valdiation
    if (!geojson) throw new Error('geojson is required');
    if (distance === undefined || distance === null || isNaN(distance)) throw new Error('distance is required');
    const distanceMeters = convertLength(distance, units, 'meters');

    var type = getType(geojson);
    var properties = geojson.properties;

    geojson = JSON.parse(JSON.stringify(geojson));

    switch (type) {
    case 'LineString':
        return lineOffsetFeature(geojson, distanceMeters);
    case 'MultiLineString':
        var coords = [];
        flattenEach(geojson, function (feature) {
            coords.push(lineOffsetFeature(feature, distanceMeters).geometry.coordinates);
        });
        return multiLineString(coords, properties);
    default:
        throw new Error('geometry ' + type + ' is not supported');
    }
}

/**
 * Line Offset
 *
 * @private
 * @param {Geometry|Feature<LineString>} line input line
 * @param {number} distance distance to offset the line (can be of negative value)
 * @param {string} [units=kilometers] units
 * @returns {Feature<LineString>} Line offset from the input line
 */
function lineOffsetFeature(line, distance) {

    var centroid = centerOfMass(line);
    var utmZone = checkUtmZone(centroid.geometry);
    reprojectFeature(line, utmZone, true);

    var segments = [];
    var coords = getCoords(line);
    var finalCoords = [];
    coords.forEach(function (currentCoords, index) {
        if (index !== coords.length - 1) {
            var segment = processSegment(currentCoords, coords[index + 1], distance);
            segments.push(segment);
            if (index > 0) {
                var seg2Coords = segments[index - 1];
                var intersects = intersection(segment, seg2Coords);

                // Handling for line segments that aren't straight
                if (intersects !== false) {
                    seg2Coords[1] = intersects;
                    segment[0] = intersects;
                }

                finalCoords.push(seg2Coords[0]);
                if (index === coords.length - 2) {
                    finalCoords.push(segment[0]);
                    finalCoords.push(segment[1]);
                }
            }
            // Handling for lines that only have 1 segment
            if (coords.length === 2) {
                finalCoords.push(segment[0]);
                finalCoords.push(segment[1]);
            }
        }
    });
    var out = lineString(finalCoords, line.properties);
    reprojectFeature(out, utmZone, false);
    return out;
}

/**
 * Process Segment
 * Inspiration taken from http://stackoverflow.com/questions/2825412/draw-a-parallel-line
 *
 * @private
 * @param {Array<number>} point1 Point coordinates
 * @param {Array<number>} point2 Point coordinates
 * @param {number} offset Offset
 * @returns {Array<Array<number>>} offset points
 */
function processSegment(point1, point2, offset) {
    var L = Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]));

    var out1x = point1[0] + offset * (point2[1] - point1[1]) / L;
    var out2x = point2[0] + offset * (point2[1] - point1[1]) / L;
    var out1y = point1[1] + offset * (point1[0] - point2[0]) / L;
    var out2y = point2[1] + offset * (point1[0] - point2[0]) / L;
    return [[out1x, out1y], [out2x, out2y]];
}

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

export default lineOffset;
