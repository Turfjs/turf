var feature = require('@turf/helpers').feature;

/**
 * Takes a GeoJSON {@link Polygon}Polygon or {@link MultiPolygon}MultiPolygon feature and returns 
 * it as a GeoJSON  {@link LineString}linestring or {@link MultiLineString}MultiLineString feature.
 *
 * @name polygonToLineString
 * @param {Feature<Polygon> | Feature<MultiPolygon> } a Polygon or MultiPolygon feature
 * @return {Feature<LineString> | Feature<MultiLinestring> a LineString or MultiLinestring feature
 * @example
 * var poly = {"type": "Feature",
 *            "geometry": {
 *                "type": "Polygon", 
 *                "coordinates": [
 *                	[[-2.275543, 53.464547],
 *                 	[-2.275543, 53.489271],
 *                  [-2.215118, 53.489271],
 *                  [-2.215118, 53.464547],
 *                  [-2.275543, 53.464547]]
 *                 ]},
 *                 "properties": {}; 
 * 
 * var newLine = turf.polygonToLineString(poly);
 * //addToMap
 * var addToMap = [newLine]
 */
 module.exports = function (polygon) {
 	var line = polygon;
 	
 	if (line.type !== 'Feature') {
 		line = feature(line);
 	}

 	if (line.geometry.type === 'Polygon') {
 		line.geometry.type = "LineString";
 	}

 	if (line.geometry.type === 'MultiPolygon') {
 		line.geometry.type = "MultiLineString";
 	}

 	// Cater for a polygon with a hole
 	if (line.geometry.type === "LineString" && line.geometry.coordinates.length > 1) {
 		line.geometry.type = "MultiLineString";
 		line.geometry.coordinates.forEach(function (coordSet) {
 			coordSet = [].concat.apply([], line.geometry.coordinates);
 		});
 	} else {
 		line.geometry.coordinates = [].concat.apply([], line.geometry.coordinates);
 	}

 	return line;
 };
