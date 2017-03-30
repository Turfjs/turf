const test = require('tape');
const {lineString, point} = require('@turf/helpers');
const distance = require('@turf/distance');
const lineDistance = require('@turf/line-distance');
const along = require('@turf/along');
const pointOnLine = require('./');

test('turf-point-on-line - first point', function (t) {
    var line = lineString([[-122.45717525482178, 37.72003306385638], [-122.45717525482178, 37.718242366859215]]);
    var pt = point([-122.45717525482178, 37.72003306385638]);

    var snapped = pointOnLine(line, pt);

    t.deepEqual(pt.geometry.coordinates, snapped.geometry.coordinates, 'pt on start does not move');
    t.equal(snapped.properties.location, 0, 'properties.location');

    t.end();
});

test('turf-point-on-line - points behind first point', function (t) {
    var line = lineString([[-122.45717525482178, 37.72003306385638], [-122.45717525482178, 37.718242366859215]]);
    var first = point(line.geometry.coordinates[0]);
    var pts = [
        point([-122.45717525482178, 37.72009306385638]),
        point([-122.45717525482178, 37.82009306385638]),
        point([-122.45716525482178, 37.72009306385638]),
        point([-122.45516525482178, 37.72009306385638])
    ];
    var expectedLocation = [
        0,
        0,
        0,
        0
    ];

    pts.forEach((pt, i) => {
        var snapped = pointOnLine(line, pt);
        t.deepEqual(first.geometry.coordinates, snapped.geometry.coordinates, 'pt behind start moves to first vertex');
        t.equal(snapped.properties.location, expectedLocation[i], 'properties.location');
    });

    t.end();
});

test('turf-point-on-line - points in front of last point', function (t) {
    var line = lineString([[-122.45616137981413, 37.72125936929241], [-122.45717525482178, 37.72003306385638], [-122.45717525482178, 37.718242366859215]]);
    var last = point(line.geometry.coordinates[line.geometry.coordinates.length - 1]);
    var pts = [
        point([-122.45696067810057, 37.71814052497085]),
        point([-122.4573630094528, 37.71813203814049]),
        point([-122.45730936527252, 37.71797927502795]),
        point([-122.45718061923981, 37.71704571582896])
    ];
    var expectedLocation = [
        0.36245175383900585,
        0.36245175383900585,
        0.36245175383900585,
        0.36245175383900585
    ];

    pts.forEach((pt, i) => {
        var snapped = pointOnLine(line, pt);
        t.deepEqual(last.geometry.coordinates, snapped.geometry.coordinates, 'pt behind start moves to last vertex');
        t.equal(snapped.properties.location, expectedLocation[i], 'properties.location');
    });

    t.end();
});

test('turf-point-on-line - points on joints', function (t) {
    var lines = [
        lineString([[-122.45616137981413, 37.72125936929241], [-122.45717525482178, 37.72003306385638], [-122.45717525482178, 37.718242366859215]]),
        lineString([[26.279296875, 31.728167146023935], [21.796875, 32.69486597787505], [18.80859375, 29.99300228455108], [12.919921874999998, 33.137551192346145], [10.1953125, 35.60371874069731], [4.921875, 36.527294814546245], [-1.669921875, 36.527294814546245], [-5.44921875, 34.74161249883172], [-8.7890625, 32.99023555965106]]),
        lineString([[-0.10919809341430663, 51.52204224896724], [-0.10923027992248535, 51.521942114455435], [-0.10916590690612793, 51.52186200668747], [-0.10904788970947266, 51.52177522311313], [-0.10886549949645996, 51.521601655468345], [-0.10874748229980469, 51.52138135712038], [-0.10855436325073242, 51.5206870765674], [-0.10843634605407713, 51.52027984939518], [-0.10839343070983887, 51.519952729849024], [-0.10817885398864746, 51.51957887606202], [-0.10814666748046874, 51.51928513164789], [-0.10789990425109863, 51.518624199789016], [-0.10759949684143065, 51.51778299991493]])
    ];
    var expectedLocation = [
        [0, 0.163112, 0.36245175383900585],
        [0, 435.639702, 849.333540, 1508.313249, 1879.816188, 2365.284001, 2954.827226, 3350.292643, 3715.379484],
        [0, 0.011368, 0.021338, 0.033993, 0.057078, 0.082928, 0.161364, 0.207427, 0.243963, 0.288155, 0.320930, 0.396465, 0.492391]
    ];

    lines.forEach((line, i) => {
        line.geometry.coordinates.map(coord => {
            return point(coord);
        }).forEach((pt, j) => {
            var snapped = pointOnLine(line, pt);
            t.deepEqual(pt.geometry.coordinates, snapped.geometry.coordinates, 'pt on joint stayed in place');
            t.equal(snapped.properties.location.toFixed(6), expectedLocation[i][j].toFixed(6), 'properties.location');
        });
    });

    t.end();
});

test('turf-point-on-line - points on top of line', function (t) {
    var line = lineString([[-0.10919809341430663, 51.52204224896724], [-0.10923027992248535, 51.521942114455435], [-0.10916590690612793, 51.52186200668747], [-0.10904788970947266, 51.52177522311313], [-0.10886549949645996, 51.521601655468345], [-0.10874748229980469, 51.52138135712038], [-0.10855436325073242, 51.5206870765674], [-0.10843634605407713, 51.52027984939518], [-0.10839343070983887, 51.519952729849024], [-0.10817885398864746, 51.51957887606202], [-0.10814666748046874, 51.51928513164789], [-0.10789990425109863, 51.518624199789016], [-0.10759949684143065, 51.51778299991493]]);
    var expectedLocation = [
        0,
        0.02112219102626062,
        0.05152902791680011,
        0.05152902791680011,
        0.10026690212472494,
        0.15159178869713177,
        0.17905126253570025,
        0.19941694973216684,
        0.19941694973216684,
        0.24635164243123242
    ];

    var dist = lineDistance(line, 'miles');
    var increment = dist / 10;

    for (var i = 0; i < 10; i++) {
        var pt = along(line, increment * i, 'miles');
        var snapped = pointOnLine(line, pt, 'miles');
        var shift = distance(pt, snapped, 'miles');
        t.true(shift < 0.000001, 'pt did not shift far');
        t.equal(snapped.properties.location, expectedLocation[i], 'properties.location');
    }

    t.end();
});

test('turf-point-on-line - point along line', function (t) {
    var line = lineString([[-122.45717525482178, 37.72003306385638], [-122.45717525482178, 37.718242366859215]]);

    var pt = along(line, 0.019, 'miles');
    var snapped = pointOnLine(line, pt);
    var shift = distance(pt, snapped, 'miles');

    t.true(shift < 0.00001, 'pt did not shift far');

    t.end();
});

test('turf-point-on-line - points on sides of lines', function (t) {
    var line = lineString([[-122.45616137981413, 37.72125936929241], [-122.45717525482178, 37.718242366859215]]);
    var first = line.geometry.coordinates[0];
    var last = line.geometry.coordinates[line.geometry.coordinates.length - 1];
    var pts = [
        point([-122.45702505111694, 37.71881098149625]),
        point([-122.45733618736267, 37.719235317933844]),
        point([-122.45686411857605, 37.72027068864082]),
        point([-122.45652079582213, 37.72063561093274])
    ];

    pts.forEach(pt => {
        var snapped = pointOnLine(line, pt);
        t.notDeepEqual(snapped.geometry.coordinates, first, 'pt did not snap to first vertex');
        t.notDeepEqual(snapped.geometry.coordinates, last, 'pt did not snap to last vertex');
    });

    t.end();
});

test('turf-point-on-line - check dist and index', t => {
    var line = lineString([[-92.09049224853516, 41.10289743708757], [-92.19108581542969, 41.07986874098993], [-92.22850799560547, 41.05605531253442], [-92.23709106445312, 41.00814350872298], [-92.22576141357422, 40.96693739752686], [-92.15023040771484, 40.93685883302701], [-92.11246490478516, 40.97756533655244], [-92.06268310546874, 41.03456405894359], [-92.10079193115234, 41.04000226828482]]);
    var pt = point([-92.11057662963867, 41.04064964423169]);
    var snapped = pointOnLine(line, pt);

    t.equal(snapped.properties.index, 8, 'properties.index');
    t.equal(snapped.properties.dist, 0.8247021054005667, 'properties.dist');
    t.deepEqual(snapped.geometry.coordinates, [-92.10079193115234, 41.04000226828482], 'coordinates');

    t.end();
});
