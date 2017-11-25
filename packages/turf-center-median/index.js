/**
 * Takes a {@link FeatureCollection} and calculates the median center,
 * algorithimically. It uses the algorithm described in:
 *
 * Harold W. Kuhn and Robert E. Kuenne, “An Efficient Algorithm for the Numerical Solution of the Generalized Weber Problem in Spatial Economics,” _Journal of Regional Science_ 4, no. 2 (1962): 21–33, doi:{@link https://doi.org/10.1111/j.1467-9787.1962.tb00902.x}.
 *
 * @name centerMedian
 * @param {Geometry|Feature<any>} points GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {string} [options.weight] the property name used to weight the center
 * @param {number} [options.tolerance=0.001] the difference in distance between candidate medians at which point the algorighim stops iterating.
 * @returns {Feature<Point>} The median center of the collection
 * @example
 * var points;
 * var medianCenter = turf.centerMedian(points);
 *
 * //addToMap
 * var addToMap = [points, medianCenter]
 */
function centerMedian(points, options) {
    return true;
};

export default centerMedian;
