# turf-jenks

[![build status](https://secure.travis-ci.org/Turfjs/turf-jenks.png)](http://travis-ci.org/Turfjs/turf-jenks)

turf jenks module


### `turf.jenks(input, field, numberOfBreaks)`

Takes a set of features and returns an array of the [Jenks Natural breaks](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)
for a given property

### Parameters

| parameter        | type              | description                                                        |
| ---------------- | ----------------- | ------------------------------------------------------------------ |
| `input`          | FeatureCollection | input features                                                     |
| `field`          | String            | the property in `input` on which to calculate Jenks natural breaks |
| `numberOfBreaks` | Number            | number of classes in which to group the data                       |


### Example

```js
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
        "coordinates": [49.859733, 40.400424]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [49.83879, 40.401209]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [49.817848, 40.376889]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 200
      },
      "geometry": {
        "type": "Point",
        "coordinates": [49.840507, 40.386043]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 300
      },
      "geometry": {
        "type": "Point",
        "coordinates": [49.854583, 40.37532]
      }
    }
  ]
};

var breaks = turf.jenks(points, 'population', 3);

//=breaks
```


**Returns** `Array.<number>`, the break number for each class plus the minimum and maximum values

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-jenks
```

## Tests

```sh
$ npm test
```


