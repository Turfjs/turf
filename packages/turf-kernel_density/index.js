/*jshint esversion: 6 */
import clone from '@turf/clone';
import distance from '@turf/distance';
import centroid from '@turf/centroid';
import pointsWithinPolygon from '@turf/points-within-polygon';
import buffer from '@turf/buffer';
import {
    point,
    radiansToLength,
    degreesToRadians
} from '@turf/helpers';
import {
    getCoord
} from '@turf/invariant';
import {
    featureEach,
    featureReduce,
    propReduce
} from '@turf/meta';
/**
 * Takes a set of {@link Point|points} and assigns its [Kernel Density]( https://pro.arcgis.com/en/pro-app/tool-reference/spatial-analyst/how-kernel-density-works.htm) value to each of them.
 * It uses the algorithm descirbed by [ESRI](https://pro.arcgis.com/en/pro-app/tool-reference/spatial-analyst/how-kernel-density-works.htm)
 *
 * @name kernelDensity
 * @param {FeatureCollection<Point>} points to be processed
 * @param {string} [weight = ''] optional weight property name
 * @returns {FeatureCollection<Point>} Same as input, with an additional property associated to each Feature:
 * - {number} kd - the associated kernel density
 * @example
 * // create random points with random z-values in their properties
 * var input_points = randomPoint(100, {bbox: [0, 30, 20, 50]});
 * var output_points = kernelDensity(points);
 *
 * //addToMap
 * var addToMap = [output_points];
 */
export default function kernelDensity(points, weight) {
    let
        output = clone(points),
        featureCount = featureReduce(output, prev => prev + 1, 0),
        mc,
        dists,
        median,
        sd,
        sr,
        _getMedian = function (values) {
            var
                l = values.length,
                m = Math.floor(0.5 * l);
            if (values === undefined || l === 0) return null;
            values.sort((a, b) => a - b);
            return (l % 2 === 1) ? values[m] : 0.5 * (values[m - 1] + values[m]);
        },
        // as described in https://pro.arcgis.com/en/pro-app/tool-reference/spatial-statistics/standard-distance.htm
        _stdDistance = function (points, weight, centroid, pointsCount) {
            let
                isWeighted = weight !== undefined && weight.length !== 0,
                m = getCoord(centroid),
                // added latitude correction factor to finetune the 'radiansToLength' function
                latCorrection = Math.cos(degreesToRadians(m[1])),
                _sum = featureReduce(output, (prev, current) => {
                    let
                        w = isWeighted ? (current.properties[weight] || 0) : 1,
                        c = getCoord(current).map((a, i) => Math.pow(w * a - m[i], 2));
                    return prev.map((a, i) => a + c[i]);
                }, [0, 0]),
                degDist = Math.sqrt((_sum[0] + _sum[1]) / pointsCount);
            return radiansToLength(degreesToRadians(degDist), 'kilometers') / latCorrection;
        };

    // find collection's centroid
    if (weight === undefined || weight.length === 0) {
        mc = centroid(output, {
            'weight': null
        });
    } else {
        let
            mw = propReduce(output, (prev, current) => prev + current[weight] * 1, 0),
            _weighted = featureReduce(output, (prev, current) => {
                const
                    w = current.properties[weight],
                    c = getCoord(current).map(a => a * w / mw);
                return prev.map((a, i) => a + c[i]);
            }, [0, 0]);
        mc = point(_weighted, {
            'weight': mw
        });
    }
    // calc the median distance from the centroid to each point (km)
    dists = featureReduce(output, (prev, current) => {
        prev.push(distance(current, mc));
    }, []);
    median = _getMedian(dists);
    // calc the standard distance (pseudo-km)
    sd = _stdDistance(output, weight, mc, featureCount);
    // calc the search radius
    sr = 0.9 * Math.min(sd, Math.sqrt(1 / Math.LN2) * median) * Math.pow(featureCount, -0.2);
    // count the features within the search radius of each feature
    // and assign it as the kernel density
    featureEach(output, current => {
        let
            area = buffer(current, sr),
            ptsWithin = pointsWithinPolygon(output, area);
        // the initial value of -1 is on purpose to disregard the point itself.
        current.properties.kernelDensity = featureReduce(ptsWithin, prev => prev + 1, -1);
    });
    return output;
}
