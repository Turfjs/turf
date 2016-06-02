# turf-circle

[![build status](https://secure.travis-ci.org/Turfjs/turf-circle.png)](http://travis-ci.org/Turfjs/turf-circle)

turf circle module


### `turf.circle(center, radius, steps, units)`

Takes a Point and calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision.


### Parameters

| parameter  | type               | description                            |
| ---------- | ------------------ | -------------------------------------- |
| `center`   | Feature\.\<Point\> | center point                           |
| `radius`   | Number             | radius of the circle                   |
| `steps`    | Number             | number of steps                        |
| `units`    | String             | miles, kilometers, degrees, or radians |


### Example

```js
var center = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-75.343, 39.984]
  }
};
var radius = 5;
var steps = 10;
var units = 'kilometers';

var circle = turf.circle(center, radius, steps, units);

var result = {
  "type": "FeatureCollection",
  "features": [center, circle]
};

//=result
```


**Returns** `Feature.<Polygon>`, circle polygon

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-circle
```

## Tests

```sh
$ npm test
```
