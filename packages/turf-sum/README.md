# turf-sum

[![build status](https://secure.travis-ci.org/Turfjs/turf-sum.png)](http://travis-ci.org/Turfjs/turf-sum)

turf sum module


### `turf.sum(polygons, points, inField, outField)`

Calculates the sum of a field for a set of Point|points within a set of Polygon|polygons.


### Parameters

| parameter  | type                           | description                         |
| ---------- | ------------------------------ | ----------------------------------- |
| `polygons` | FeatureCollection\.\<Polygon\> | input polygons                      |
| `points`   | FeatureCollection\.\<Point\>   | input points                        |
| `inField`  | String                         | the field in input data to analyze  |
| `outField` | String                         | the field in which to store results |


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
          [-87.990188, 43.026486],
          [-87.990188, 43.062115],
          [-87.913284, 43.062115],
          [-87.913284, 43.026486],
          [-87.990188, 43.026486]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-87.973709, 42.962452],
          [-87.973709, 43.014689],
          [-87.904014, 43.014689],
          [-87.904014, 42.962452],
          [-87.973709, 42.962452]
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
        "coordinates": [-87.974052, 43.049321]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-87.957229, 43.037277]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-87.931137, 43.048568]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-87.963409, 42.99611]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 300
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-87.94178, 42.974762]
      }
    }
  ]
};

var aggregated = turf.sum(
  polygons, points, 'population', 'sum');

var resultFeatures = points.features.concat(
  aggregated.features);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `FeatureCollection.<Polygon>`, polygons with properties listed as `outField`

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-sum
```

## Tests

```sh
$ npm test
```


