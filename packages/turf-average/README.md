# turf-average

[![build status](https://secure.travis-ci.org/Turfjs/turf-average.png)](http://travis-ci.org/Turfjs/turf-average)

turf average module


### `turf.average(polygons, points, field, outputField)`

Calculates the average value of a field for a set of Point|points within a set of Polygon|polygons.


### Parameters

| parameter     | type                           | description                                                             |
| ------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `polygons`    | FeatureCollection\.\<Polygon\> | polygons with values on which to average                                |
| `points`      | FeatureCollection\.\<Point\>   | points from which to calculate the average                              |
| `field`       | String                         | the field in the `points` features from which to pull values to average |
| `outputField` | String                         | the field in `polygons` to put results of the averages                  |


### Example

```js
var polygons = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [10.666351, 59.890659],
          [10.666351, 59.936784],
          [10.762481, 59.936784],
          [10.762481, 59.890659],
          [10.666351, 59.890659]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [10.764541, 59.889281],
          [10.764541, 59.937128],
          [10.866165, 59.937128],
          [10.866165, 59.889281],
          [10.764541, 59.889281]
        ]]
      }
    }
  ]
};
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [10.724029, 59.926807]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [10.715789, 59.904778]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [10.746002, 59.908566]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [10.806427, 59.908910]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 300
      },
      "geometry": {
        "type": "Point",
        "coordinates": [10.79544, 59.931624]
      }
    }
  ]
};

var averaged = turf.average(
 polygons, points, 'population', 'pop_avg');

var resultFeatures = points.features.concat(
  averaged.features);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `FeatureCollection.<Polygon>`, polygons with the value of `outField` set to the calculated averages

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-average
```

## Tests

```sh
$ npm test
```


