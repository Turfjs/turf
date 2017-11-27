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
 * The calculations for this function are found in:
 *
 * Philip J. Clark and Francis C. Evans, “Distance to Nearest Neighbor as a
 * Measure of Spatial Relationships in Populations,” _Ecology_ 35, no. 4
 * (1954): 445–453, doi:[10.2307/1931034](http://doi.org/10.2307/1931034).
 *
 * @name nearestNeighborAnalysis
 * @param {FeatureCollection<Point>} dataset FeatureCollection of points to study
 * @param {Object} [options={}] Optional parameters
 * @param {Feature<Polygon} [options.studyAreaPolygon] A polygon representing the study area 
 * @param {number} [options.studyAreaArea] The area of the study area
 * @param {string} [options.units='kilometers'] unit of measurement for for distances and, squared, area.
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
function nearestNeighborAnalysis(feature1, feature2) {
    return true;
};

export default nearestNeighborAnalysis;
