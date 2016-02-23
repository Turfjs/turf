# turf-quantile

[![build status](https://secure.travis-ci.org/Turfjs/turf-quantile.png)](http://travis-ci.org/Turfjs/turf-quantile)

turf quantile module


### `turf.quantile(input, field, percentiles)`

Takes a FeatureCollection, a property name, and a set of percentiles and returns a quantile array.

### Parameters

| parameter     | type              | description                                                    |
| ------------- | ----------------- | -------------------------------------------------------------- |
| `input`       | FeatureCollection | set of features                                                |
| `field`       | String            | the property in `input` from which to retrieve quantile values |
| `percentiles` | Array\.\<number\> | an Array of percentiles on which to calculate quantile values  |


### Example

```js
var points = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "population": 5
      },
      "geometry": {
        "type": "Point",
        "coordinates": [5, 5]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 40
      },
      "geometry": {
        "type": "Point",
        "coordinates": [1, 3]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 80
      },
      "geometry": {
        "type": "Point",
        "coordinates": [14, 2]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 90
      },
      "geometry": {
        "type": "Point",
        "coordinates": [13, 1]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 100
      },
      "geometry": {
        "type": "Point",
        "coordinates": [19, 7]
      }
    }
  ]
};

var breaks = turf.quantile(
  points, 'population', [25, 50, 75, 99]);

//=breaks
```


**Returns** `Array.<number>`, an array of the break values

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-quantile
```

## Tests

```sh
$ npm test
```


