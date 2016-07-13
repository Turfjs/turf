var test = require('tape');
var pointOnLine = require('../');
var point = require('@turf/helpers').point;
var featurecollection = require('@turf/helpers').featureCollection;
var linestring = require('@turf/helpers').lineString;
var distance = require('@turf/distance');
var lineDistance = require('@turf/line-distance');
var along = require('@turf/along');

test('turf-point-on-line - first point', function (t) {
    var line = linestring([[-122.45717525482178,37.72003306385638],[-122.45717525482178,37.718242366859215]]);
    var pt = point([-122.45717525482178,37.72003306385638]);

    var snapped = pointOnLine(line, pt);

    t.deepEqual(pt.geometry.coordinates, snapped.geometry.coordinates, 'pt on start does not move');

    t.end();
});

test('turf-point-on-line - points behind first point', function (t) {
    var line = linestring([[-122.45717525482178,37.72003306385638],[-122.45717525482178,37.718242366859215]]);
    var first = point(line.geometry.coordinates[0])
    var pts = [
        point([-122.45717525482178,37.72009306385638]),
        point([-122.45717525482178,37.82009306385638]),
        point([-122.45716525482178,37.72009306385638]),
        point([-122.45516525482178,37.72009306385638])
    ];

    pts.forEach(function(pt){
        var snapped = pointOnLine(line, pt);
        t.deepEqual(first.geometry.coordinates, snapped.geometry.coordinates, 'pt behind start moves to first vertex');
    });
    
    t.end();
});

test('turf-point-on-line - points in front of last point', function (t) {
    var line = linestring([[-122.45616137981413,37.72125936929241],[-122.45717525482178,37.72003306385638],[-122.45717525482178,37.718242366859215]]);
    var last = point(line.geometry.coordinates[line.geometry.coordinates.length - 1])
    var pts = [
        point([-122.45696067810057,37.71814052497085]),
        point([-122.4573630094528,37.71813203814049]),
        point([-122.45730936527252,37.71797927502795]),
        point([-122.45718061923981,37.71704571582896])
    ];

    pts.forEach(function(pt){
        var snapped = pointOnLine(line, pt);
        t.deepEqual(last.geometry.coordinates, snapped.geometry.coordinates, 'pt behind start moves to last vertex');
    });
    
    t.end();
});

test('turf-point-on-line - points on joints', function (t) {
    var lines = [
        linestring([[-122.45616137981413,37.72125936929241],[-122.45717525482178,37.72003306385638],[-122.45717525482178,37.718242366859215]]),
        linestring([[26.279296875,31.728167146023935],[21.796875,32.69486597787505],[18.80859375,29.99300228455108],[12.919921874999998,33.137551192346145],[10.1953125,35.60371874069731],[4.921875,36.527294814546245],[-1.669921875,36.527294814546245],[-5.44921875,34.74161249883172],[-8.7890625,32.99023555965106]]),
        linestring([[-0.10919809341430663,51.52204224896724],[-0.10923027992248535,51.521942114455435],[-0.10916590690612793,51.52186200668747],[-0.10904788970947266,51.52177522311313],[-0.10886549949645996,51.521601655468345],[-0.10874748229980469,51.52138135712038],[-0.10855436325073242,51.5206870765674],[-0.10843634605407713,51.52027984939518],[-0.10839343070983887,51.519952729849024],[-0.10817885398864746,51.51957887606202],[-0.10814666748046874,51.51928513164789],[-0.10789990425109863,51.518624199789016],[-0.10759949684143065,51.51778299991493]])
    ];

    lines.forEach(function(line){
        line.geometry.coordinates.map(function(coord){
            return point(coord);
        }).forEach(function(pt){
            var snapped = pointOnLine(line, pt);
            t.deepEqual(pt.geometry.coordinates, snapped.geometry.coordinates, 'pt on joint stayed in place');
        });
    });
    
    t.end();
});

test('turf-point-on-line - points on top of line', function (t) {
    var line = linestring([[-0.10919809341430663,51.52204224896724],[-0.10923027992248535,51.521942114455435],[-0.10916590690612793,51.52186200668747],[-0.10904788970947266,51.52177522311313],[-0.10886549949645996,51.521601655468345],[-0.10874748229980469,51.52138135712038],[-0.10855436325073242,51.5206870765674],[-0.10843634605407713,51.52027984939518],[-0.10839343070983887,51.519952729849024],[-0.10817885398864746,51.51957887606202],[-0.10814666748046874,51.51928513164789],[-0.10789990425109863,51.518624199789016],[-0.10759949684143065,51.51778299991493]]);

    var dist = lineDistance(line, 'miles');
    var increment = dist / 10;

    for (var i = 0; i < 10; i++) {
        var pt = along(line, increment * i, 'miles');
        var snapped = pointOnLine(line, pt);
        var shift = distance(pt, snapped, 'miles');
        t.true(shift < 0.000001, 'pt did not shift far');    
    }

    t.end();
});

test('turf-point-on-line - point along line', function (t) {
    var line = linestring([[-122.45717525482178,37.72003306385638],[-122.45717525482178,37.718242366859215]]);

    var pt = along(line, 0.019, 'miles');
    var snapped = pointOnLine(line, pt);
    var shift = distance(pt, snapped, 'miles');

    t.true(shift < 0.00001, 'pt did not shift far');    

    t.end();
});

test('turf-point-on-line - points on sides of lines', function (t) {
    var line = linestring([[-122.45616137981413,37.72125936929241],[-122.45717525482178,37.718242366859215]]);
    var first = line.geometry.coordinates[0];
    var last = line.geometry.coordinates[line.geometry.coordinates.length - 1];
    var pts = [
        point([-122.45702505111694,37.71881098149625]),
        point([-122.45733618736267,37.719235317933844]),
        point([-122.45686411857605,37.72027068864082]),
        point([-122.45652079582213,37.72063561093274])
    ];

    pts.forEach(function(pt){
        var snapped = pointOnLine(line, pt);
        t.notDeepEqual(snapped.geometry.coordinates, first, 'pt did not snap to first vertex');
        t.notDeepEqual(snapped.geometry.coordinates, last, 'pt did not snap to last vertex');
    });

    t.end();
});
