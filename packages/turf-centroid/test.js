var geojsonFixtures = require('geojson-fixtures/helper');
geojsonFixtures(require('tape'), 'all', require('./'), __dirname + '/test');
