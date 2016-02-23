var aggregate = require('./');
var test = require('tape');
var polygon = require('turf-helpers').polygon;
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;

test('aggregate', function(t){
  var poly1 = polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]);
  var poly2 = polygon([[[10,0],[20,10],[20,20],[20,0],[10,0]]]);
  var polyFC = featurecollection([poly1, poly2]);
  var pt1 = point([5,5], {population: 200});
  var pt2 = point([1,3], {population: 600});
  var pt3 = point([14,2], {population: 100});
  var pt4 = point([13,1], {population: 200});
  var pt5 = point([19,7], {population: 300});
  var ptFC = featurecollection([pt1, pt2, pt3, pt4, pt5]);
  var aggregations = [
    {
      aggregation: 'sum',
      inField: 'population',
      outField: 'pop_sum'
    },
    {
      aggregation: 'average',
      inField: 'population',
      outField: 'pop_avg'
    },
    {
      aggregation: 'median',
      inField: 'population',
      outField: 'pop_median'
    },
    {
      aggregation: 'min',
      inField: 'population',
      outField: 'pop_min'
    },
    {
      aggregation: 'max',
      inField: 'population',
      outField: 'pop_max'
    },
    {
      aggregation: 'deviation',
      inField: 'population',
      outField: 'pop_deviation'
    },
    {
      aggregation: 'variance',
      inField: 'population',
      outField: 'pop_variance'
    },
    {
      aggregation: 'count',
      inField: '',
      outField: 'point_count'
    }
  ];

  var aggregated = aggregate(polyFC, ptFC, aggregations);
  t.equal(aggregated.features[0].properties.pop_sum, 800);
  t.equal(aggregated.features[1].properties.pop_sum, 600);
  t.equal(aggregated.features[0].properties.pop_avg, 400);
  t.equal(aggregated.features[1].properties.pop_avg, 200);
  t.equal(aggregated.features[0].properties.pop_median, 400);
  t.equal(aggregated.features[1].properties.pop_median, 200);
  t.equal(aggregated.features[0].properties.pop_min, 200);
  t.equal(aggregated.features[1].properties.pop_min, 100);
  t.equal(aggregated.features[0].properties.pop_max, 600);
  t.equal(aggregated.features[1].properties.pop_max, 300);
  t.ok(aggregated.features[0].properties.pop_deviation);
  t.ok(aggregated.features[1].properties.pop_deviation);
  t.ok(aggregated.features[0].properties.pop_variance);
  t.ok(aggregated.features[1].properties.pop_variance);
  t.end();
});
