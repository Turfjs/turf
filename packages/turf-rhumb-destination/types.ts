import { point } from '@turf/helpers'
import rhumbDestination from './'

var pt = point([-75.343, 39.984], {"marker-color": "F00"});
var distance = 50;
var bearing = 90;

var destination = rhumbDestination(pt, distance, bearing, {units: 'miles'});

//addToMap
var addToMap = [pt, destination]
destination.properties['marker-color'] = '#00F';