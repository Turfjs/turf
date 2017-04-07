const test = require('tape');
const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const write = require('write-json-file');
const polyToLineString = require('./');

const directories = {
	in: path.join(__dirname, 'test', 'in') + path.sep,
	out: path.join(__dirname, 'test', 'out') + path.sep
};

const fixtures = fs.readdirSync(directories.in).map(filename => {
	return {
		filename,
		name: path.parse(filename).name,
		geojson: load.sync(directories.in + filename)
	};
});
process.env.REGEN = true;

test('turf-polygon-to-linestring', t => {
	for (const {name, geojson} of fixtures) {
		var results = polyToLineString(geojson)
		console.log('Input File: ' + name + '.geojson')
		if (process.env.REGEN){
			write.sync(directories.out + name + '.json', results);
		}
		
		// Tests for MultiPolygon
		if (geojson.geometry && geojson.geometry.type === 'MultiPolygon') {
			var inputNumberPolys = geojson.geometry.coordinates.length
			var outputNumberPolys = results.geometry.coordinates.length
			t.equal(results.geometry.type, 'MultiLineString', 'Has got the correct type');
			t.equal(inputNumberPolys, outputNumberPolys, 'Got the right number of lines');
			t.equal(results.geometry.coordinates[0][0][0], geojson.geometry.coordinates[0][0][0][0], 'has retained correct first coords');
		} 
		
		// Tests for Polygon with hole
		if (geojson.geometry && geojson.geometry.coordinates.length > 1  && geojson.geometry.type === 'Polygon') {
			var inputLength = geojson.geometry.coordinates.length
			var convertedLength = results.geometry.coordinates.length
			t.equal(results.geometry.type, 'MultiLineString', 'Has got the correct type');
			t.equal(convertedLength, inputLength, 'Has the right number of lines');
		} 

		// Tests for a feature
		if (geojson.geometry && geojson.geometry.coordinates.length === 1) {
			var inputLength = geojson.geometry.coordinates[0].length
			var convertedLength = results.geometry.coordinates.length		
			t.equal(results.geometry.coordinates[0][0], geojson.geometry.coordinates[0][0][0], 'has retained correct first coords');
			t.equal(convertedLength, inputLength, 'has the right number of vertices');
			t.equal(results.geometry.coordinates[convertedLength - 1][1], geojson.geometry.coordinates[0][inputLength - 1][1], 'has retained correct last coords');	
		}

		// Tests for a raw polygon (not a feature)
		if (!geojson.geometry) {
			t.equal(results.type, 'Feature', 'Has got the correct type');
			t.equal(results.geometry.type, 'LineString', 'Has got the correct type');
		}

	}
	t.end();
});




