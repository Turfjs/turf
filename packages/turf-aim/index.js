var distance = require('turf-distance');
var bearing = require('turf-bearing');
var destination = require('turf-destination');

/**
 * Takes two {@link Point}s and returns a Point with given speeds of target and projectile and bearing of target and units.
 *
 * @name aim
 * @param {Point} target initial location of target
 * @param {Point} projectile initial location of projectile
 * @param {number} t_velocity velocity of target
 * @param {number} p_velocity velocity of projectile
 * @param {number} t_bearing target bearing ranging from -180 to 180
 * @param {String} [units=kilometers] miles, kilometers, degrees, or radians
 * @return {Point|null} point of impact if projectile can catch target, otherwise null
 * @example
 * var target = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#0f0"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [30, 41]
 *   }
 * };
 * var projectile = {
 *   "type": "Feature",
 *   "properties": {
 *     "marker-color": "#f00"
 *   },
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [29, 41]
 *   }
 * };
 * var t_velocity = 10;
 * var p_velocity = 50;
 * var t_bearing = 60;
 * var units = 'kilometers';
 *
 * var impact = turf.aim(target, projectile, t_velocity, p_velocity, t_bearing, units);
 * impact.properties['marker-color'] = '#00f';
 *
 * var result = {
 *   "type": "FeatureCollection",
 *   "features": [target, projectile, impact]
 * };
 *
 * //=result
 */

module.exports = function (target, projectile, t_velocity, p_velocity, t_bearing, units) {
    var start_distance = distance(projectile, target, units);
    var start_bearing = bearing(projectile, target);

    var a = Math.pow(t_velocity, 2) - Math.pow(p_velocity, 2);
    var b = 2 * start_distance * t_velocity * Math.cos((t_bearing - start_bearing) * Math.PI / 180);
    var c = Math.pow(start_distance, 2);

    var sol = quad(a, b, c);

    if (!sol) return null;

    var t = Math.min(sol[0], sol[1]);
    if (t < 0)  {
        t = Math.max(sol[0], sol[1])
    }
    if (t < 0) {
        return null;
    }

    return destination(target, t_velocity * t, t_bearing, units);
};

function quad (a, b, c) {
    if (Math.abs(a) < 1e-6) {
        if (Math.abs(b) < 1e-6) {
            return Math.abs(c) < 1e-6 ? [0, 0] : null;
        }

        return [-c / b, -c / b];
    } else {
        var disc = b * b - 4 * a * c;

        if (disc < 0) {
            return null;
        }

        disc = Math.sqrt(disc);
        a *= 2;
        return [(-b - disc) / a, (-b + disc) / a];
    }
}
