# turf-nearest

[![build status](https://secure.travis-ci.org/Turfjs/turf-nearest.png)](http://travis-ci.org/Turfjs/turf-nearest)

turf nearest module


### `turf.nearest(point, against)`

Takes a reference Point|point and a set of points and returns the point from the set closest to the reference.


### Parameters

| parameter | type                         | description         |
| --------- | ---------------------------- | ------------------- |
| `point`   | Feature\.\<Point\>           | the reference point |
| `against` | FeatureCollection\.\<Point\> | input point set     |


### Example

```js
var point = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [28.965797, 41.010086]
  }
};
var against = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [28.973865, 41.011122]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [28.948459, 41.024204]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [28.938674, 41.013324]
      }
    }
  ]
};

var nearest = turf.nearest(point, against);
nearest.properties['marker-color'] = '#f00';

var resultFeatures = against.features.concat(point);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `Feature.<Point>`, the closest point in the set to the reference point

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-nearest
```

## Tests

```sh
$ npm test
```


