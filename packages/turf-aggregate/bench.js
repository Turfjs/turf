var aggregate = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');
var polygon = require('turf-helpers').polygon;
var point = require('turf-helpers').point;
var featurecollection = require('turf-helpers').featureCollection;

var poly1 = polygon([[[0,0],[10,0],[10,10],[0,10]]])
var poly2 = polygon([[[10,0],[20,10],[20,20], [20,0]]])
var polyFC = featurecollection([poly1, poly2])
var pt1 = point(5,5, {population: 200})
var pt2 = point(1,3, {population: 600})
var pt3 = point(14,2, {population: 100})
var pt4 = point(13,1, {population: 200})
var pt5 = point(19,7, {population: 300})
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
  ]

var ptFC = featurecollection([pt1, pt2, pt3, pt4, pt5])
var suite = new Benchmark.Suite('turf-aggregate');
suite
  .add('turf-aggregate',function() {
    aggregate(polyFC, ptFC, aggregations)
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    
  })
  .run();