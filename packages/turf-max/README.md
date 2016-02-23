# turf-max

[![build status](https://secure.travis-ci.org/Turfjs/turf-max.png)](http://travis-ci.org/Turfjs/turf-max)

turf max module


### `turf.max(polygons, points, inField, outField)`

Calculates the maximum value of a field for a set of Point|points within a set of Polygon|polygons.


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
          [101.551437, 3.150114],
          [101.551437, 3.250208],
          [101.742324, 3.250208],
          [101.742324, 3.150114],
          [101.551437, 3.150114]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [101.659927, 3.011612],
          [101.659927, 3.143944],
          [101.913986, 3.143944],
          [101.913986, 3.011612],
          [101.659927, 3.011612]
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
        "coordinates": [101.56105, 3.213874]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [101.709365, 3.211817]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [101.645507, 3.169311]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [101.708679, 3.071266]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 300
      },
      "geometry": {
        "type": "Point",
        "coordinates": [101.826782, 3.081551]
      }
    }
  ]
};

var aggregated = turf.max(
  polygons, points, 'population', 'max');

var resultFeatures = points.features.concat(
  aggregated.features);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `FeatureCollection.<Polygon>`, polygons with properties listed as `outField` values

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-max
```

## Tests

```sh
$ npm test
```


