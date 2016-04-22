# turf-idw
Today a plain IDW alg. implemented in JS. Tomorrow a Turf.js package? Maybe?


### `IDW(controlPoints, valueField, b, cellWidth, units)`

Takes a set of known sampled points, a property containing data value, an exponent parameter, a cell depth, a unit of measurement and returns a set of square polygons in a grid with an IDW value for each cell.

Based on the [Inverse Distance Weighting](https://en.wikipedia.org/wiki/Inverse_distance_weighting) interpolation algorithm as covered in the following (among other) resources: [1], [2].



### Parameters

| parameter   | type           | description                              |
| ----------- | -------------- | ---------------------------------------- |
| `controlPoints`    | FeatureCollection<Point> | Sampled points with known value |
| `valueField`    | String | GeoJSON field containing the data value to interpolate on |
| `b` | Number         | Exponent regulating the distance weighting                       |
| `cellWidth`     | Number         | The distance across each cell               |
| `units`        |String | Used in calculating cellWidth ('miles' or 'kilometers')|

### Example

```js
// load IDW
var IDW = require('./index.js')

// load a sample of test points
var fs = require('fs');
var controlPoints = JSON.parse(fs.readFileSync('./data/data.geojson'));

// produce an interpolated surface
var IDWSurface = IDW(controlPoints,'value', 0.5, 0.1,'kilometers');

```

## Installation & Use

Requires [nodejs](http://nodejs.org/).

`Git clone` this repo, then `require` it

## Tests

```sh
$ npm test
```

## Resources
[1] _O’Sullivan, D., & Unwin, D. (2010). Geographic Information Analysis (2nd Edition). 432pp. Hoboken, New Jersey (USA): John Wiley & Sons, Inc._

[2] _Xiao, N. (2016). GIS Algorithms, 336pp. SAGE Publications Ltd._
