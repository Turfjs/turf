# turf-buffer

[![build status](https://secure.travis-ci.org/Turfjs/turf-buffer.png)](http://travis-ci.org/Turfjs/turf-buffer)

turf buffer module


### `turf.buffer(feature, distance, unit)`

Calculates a buffer for input features for a given radius. Units supported are miles, kilometers, and degrees.


### Parameters

| parameter  | type                       | description                                           |
| ---------- | -------------------------- | ----------------------------------------------------- |
| `feature`  | Feature\,FeatureCollection | input to be buffered                                  |
| `distance` | Number                     | distance to draw the buffer                           |
| `unit`     | String                     | 'miles', 'feet', 'kilometers', 'meters', or 'degrees' |


### Example

```js
var pt = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-90.548630, 14.616599]
  }
};
var unit = 'miles';

var buffered = turf.buffer(pt, 500, unit);
var result = turf.featurecollection([buffered, pt]);

//=result
```


**Returns** `FeatureCollection.<Polygon>,FeatureCollection.<MultiPolygon>,Polygon,MultiPolygon`, buffered features 

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-buffer
```

## Tests

```sh
$ npm test
```


