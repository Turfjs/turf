# turf-count

[![build status](https://secure.travis-ci.org/Turfjs/turf-count.png)](http://travis-ci.org/Turfjs/turf-count)

turf count module


### `turf.count(polygons, points, countField)`

Takes a set of Point|points and a set of Polygon|polygons and calculates the number of points that fall within the set of polygons.


### Parameters

| parameter    | type                           | description                                                                           |
| ------------ | ------------------------------ | ------------------------------------------------------------------------------------- |
| `polygons`   | FeatureCollection\.\<Polygon\> | input polygons                                                                        |
| `points`     | FeatureCollection\.\<Point\>   | input points                                                                          |
| `countField` | String                         | a field to append to the attributes of the Polygon features representing Point counts |


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
          [-112.072391,46.586591],
          [-112.072391,46.61761],
          [-112.028102,46.61761],
          [-112.028102,46.586591],
          [-112.072391,46.586591]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-112.023983,46.570426],
          [-112.023983,46.615016],
          [-111.966133,46.615016],
          [-111.966133,46.570426],
          [-112.023983,46.570426]
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
        "coordinates": [-112.0372, 46.608058]
      }
    }, {
      "type": "Feature",
      "properties": {
        "population": 600
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-112.045955, 46.596264]
      }
    }
  ]
};

var counted = turf.count(polygons, points, 'pt_count');

var resultFeatures = points.features.concat(counted.features);
var result = {
  "type": "FeatureCollection",
  "features": resultFeatures
};

//=result
```


**Returns** `FeatureCollection.<Polygon>`, polygons with `countField` appended

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-count
```

## Tests

```sh
$ npm test
```


