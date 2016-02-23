# turf-convex

[![build status](https://secure.travis-ci.org/Turfjs/turf-convex.png)](http://travis-ci.org/Turfjs/turf-convex)




### `turf.convex(input)`

Takes a set of Point|points and returns a
[convex hull](http://en.wikipedia.org/wiki/Convex_hull) polygon.

Internally this uses
the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that
implements a [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).


### Parameters

| parameter | type                         | description  |
| --------- | ---------------------------- | ------------ |
| `input`   | FeatureCollection\.\<Point\> | input points |


### Example

```js
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.195312, 43.755225]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.404052, 43.8424511]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.579833, 43.659924]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.360107, 43.516688]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.14038, 43.588348]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [10.195312, 43.755225]
      }
    }
  ]
};

var hull = turf.convex(points);

var resultFeatures = points.features.concat(hull);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `Feature.<Polygon>`, a convex hull

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-convex
```

## Tests

```sh
$ npm test
```


