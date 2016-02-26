var geojsonFixtures = require('geojson-fixtures/helper');
geojsonFixtures(require('tape'), 'all', require('./'), __dirname + '/test', false, function(t, input, output) {
    t.ok(typeof output === 'number', 'output is number');
    t.ok(output >= 0, 'area is positive or zero');
});
