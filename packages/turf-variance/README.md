# turf-variance

[![build status](https://secure.travis-ci.org/Turfjs/turf-variance.png)](http://travis-ci.org/Turfjs/turf-variance)

turf variance module


### `turf.variance(polygons, points, inField, outField)`

Calculates the variance value of a field for a set of Point|points within a set of Polygon|polygons.


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
          [-97.414398, 37.684092],
          [-97.414398, 37.731353],
          [-97.332344, 37.731353],
          [-97.332344, 37.684092],
          [-97.414398, 37.684092]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-97.333717, 37.606072],
          [-97.333717, 37.675397],
          [-97.237586, 37.675397],
          [-97.237586, 37.606072],
          [-97.333717, 37.606072]
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
        "coordinates": [-97.401351, 37.719676]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.355346, 37.706639]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.387962, 37.70012]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.301788, 37.66507]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 300
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-97.265052, 37.643325]
      }
    }
  ]
};

var aggregated = turf.variance(
  polygons, points, 'population', 'variance');

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
$ npm install turf-variance
```

## Tests

```sh
$ npm test
```


