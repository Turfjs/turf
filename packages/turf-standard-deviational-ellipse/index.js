/**
 * Takes a {@link FeatureCollection} and returns a standard deviational ellipse,
 * also known as a “directional distribution.” The standard deviational ellipse
 * aims to show the direction and the distribution of a dataset by drawing
 * an ellipse that contains about one standard deviation’s worth (~ 70%) of the
 * data. 
 * 
 * This module was created in consultation with the following articles:
 *
 * • Robert S. Yuill, “The Standard Deviational Ellipse; An Updated Tool for 
 * Spatial Description,” _Geografiska Annaler_ 53, no. 1 (1971): 28–39, 
 * doi:{@link https://doi.org/10.2307/490885|10.2307/490885}.
 *
 * • Paul Hanly Furfey, “A Note on Lefever’s “Standard Deviational Ellipse,” 
 * _American Journal of Sociology_ 33, no. 1 (1927): 94—98, 
 * doi:{@link https://doi.org/10.1086/214336|10.1086/214336}.
 *
 * It mirrors the functionality of {@link http://desktop.arcgis.com/en/arcmap/10.3/tools/spatial-statistics-toolbox/directional-distribution.htm|Directional Distribution} in ArcGIS and the {@link http://arken.nmbu.no/~havatv/gis/qgisplugins/SDEllipse/|QGIS Standard Deviational Ellipse Plugin}.
 *
 * @name standardDeviationalEllipse
 * @param {Geometry|FeatureCollection<Point>} points GeoJSON points
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.weight] the property name used to weight the center
 * @param {number} [options.steps=64] number of steps for the polygon
 * @param {Object} [options.properties={}] properties to pass to the resulting ellipse
 * @returns {Feature<Polygon>} an elliptical Polygon that includes approximately 1 SD of the dataset within it.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([-97.522259, 35.4691], {weight: 10}),
 *   turf.point([-97.502754, 35.463455], {weight: 3}),
 *   turf.point([-97.508269, 35.463245], {weight: 5})
 * ]);
 *
 * var options = {weight: "weight"}
 * var sdEllipse = turf.standardDeviationalEllipse(features, options);
 * 
 * //addToMap
 * var addToMap = [features, sdEllipse];
 *
 */
function standardDeviationalEllipse(feature1, feature2) {
    return true;
};

export default standardDeviationalEllipse;
