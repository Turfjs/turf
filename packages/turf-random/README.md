# turf-random

[![build status](https://secure.travis-ci.org/Turfjs/turf-random.png)](http://travis-ci.org/Turfjs/turf-random)

generate random features


### `turf.random([type='point'], [count=1], options, options.bbox, [options.num_vertices=10], [options.max_radial_length=10])`

Generates random GeoJSON data, including Point|Points and Polygon|Polygons, for testing
and experimentation.


### Parameters

| parameter                        | type              | description                                                                                                                                                                                      |
| -------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[type='point']`                 | String            | _optional:_ type of features desired: 'points' or 'polygons'                                                                                                                                     |
| `[count=1]`                      | Number            | _optional:_ how many geometries should be generated.                                                                                                                                             |
| `options`                        | Object            | options relevant to the feature desired. Can include:                                                                                                                                            |
| `options.bbox`                   | Array\.\<number\> | a bounding box inside of which geometries are placed. In the case of Point features, they are guaranteed to be within this bounds,
while Polygon features have their centroid within the bounds. |
| `[options.num_vertices=10]`      | Number            | _optional:_ options.vertices the number of vertices added to polygon features.                                                                                                                   |
| `[options.max_radial_length=10]` | Number            | _optional:_ the total number of decimal degrees longitude or latitude that a polygon can extent outwards to
from its center.                                                                     |


### Example

```js
var points = turf.random('points', 100, {
  bbox: [-70, 40, -60, 60]
});

//=points

var polygons = turf.random('polygons', 4, {
  bbox: [-70, 40, -60, 60]
});

//=polygons
```


**Returns** `FeatureCollection`, generated random features

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-random
```

## Tests

```sh
$ npm test
```


