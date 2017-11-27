import area from '@turf/area';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import centroid from '@turf/centroid';
import distance from '@turf/distance';
import geojsonType from '@turf/invariant';
import nearestPoint from '@turf/nearest-point';
import { featureEach } from '@turf/meta';
import { featureCollection } from '@turf/helpers';

/**
 * Nearest Neighbor Analysis calculates an index based the average distances
 * between points in the dataset, thereby providing inference as to whether the
 * data is clustered, dispersed, or randomly distributed within the study area.
 *
 * It returns a {@link Feature<Polygon>} of the study area, with the results of
 * the analysis attached as part of of the `nearestNeighborAnalysis` property
 * of the study area's `properties`.
 *
 * **Remarks**
 *
 * * Though the analysis will work on any {@link FeatureCollection} type, it
 * works best with {@link Point} collections.
 *
 * * This analysis is _very_ sensitive to the study area provided. If no
 * {@link Feature<Polygon> is passed as the study area, the function draws a
 * box around the data, which may distort the findings. This analysis works
 * best with a bounded area of interest within with the data is either
 * clustered, dispersed, or randomly distributed.
 *
 * **Bibliography**
 *
 * * Philip J. Clark and Francis C. Evans, “Distance to Nearest Neighbor as a
 * Measure of Spatial Relationships in Populations,” _Ecology_ 35, no. 4
 * (1954): 445–453, doi:[10.2307/1931034](http://doi.org/10.2307/1931034).
 *
 * @name nearestNeighborAnalysis
 * @param {FeatureCollection<any>} dataset FeatureCollection (pref. of points) to study
 * @param {Object} [options={}] Optional parameters
 * @param {Feature<Polygon} [options.studyArea] A polygon representing the study area 
 * @param {string} [options.units='kilometers'] unit of measurement for distances and, squared, area.
 * @param {Object} [options.properties={}] properties
 * @returns {Feature<Polygon>} A polygon of the study area or an approximation of one.
 * @example
 * var bbox = [-65, 40, -63, 42];
 * var dataset = turf.randomPoint(100, { bbox: bbox });
 * var nearestNeighborStudyArea = turf.nearestNeighborAnalysis(dataset);
 * 
 * //addToMap
 * var addToMap = [dataset, nearestNeighborStudyArea];
 */
function nearestNeighborAnalysis(dataset, options) {
    // Optional params
    options = options || {};
    studyArea = options.studyArea || bboxPolygon(bbox(dataset));
    properties = options.properties || {};
    units = options.units || 'kilometers';

    var features = [];
    featureEach(dataset, function(feature){
      features.push(centroid(feature))
    });

    return studyArea

};

export default nearestNeighborAnalysis;
