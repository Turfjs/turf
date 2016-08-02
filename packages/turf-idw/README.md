# Inverse Distance Weighting (I.D.W.)

Inverse Distance Weighting (IDW) is a type of deterministic, nonlinear interpolation method over a set of points.

### `IDW(controlPoints, valueField, b, cellWidth, units)`

Takes a [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>  of sampled points with a property of *known value* and returns a [FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>  [grid](http://turfjs.org/docs/#squaregrid) with an *interpolated value* for each grid cell, according to a distance-decay exponent and a cell depth parameter (in the specified unit of measurement).

It is based on the [Inverse Distance Weighting](https://en.wikipedia.org/wiki/Inverse_distance_weighting) interpolation algorithm as covered in the following resources: [1], [2].

It finds application when in need of creating a continuous surface (i.e. rainfall, temperature, chemical dispersion surface...) from a set of spatially scattered points.




### Parameters

| parameter   | type           | description                              |
| ----------- | -------------- | ---------------------------------------- |
| `controlPoints`    | **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[Point](http://geojson.org/geojson-spec.html#point)>** | Sampled points with known value |
| `valueField`    | **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** | GeoJSON field containing the known value to interpolate on |
| `b` | **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**         | Exponent regulating the distance-decay weighting                       |
| `cellWidth`     |**[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**        | Width of each cell               |
| `units`        |**[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** |  Units to use for cellWidth ('miles' or 'kilometers')|

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
Returns a **[FeatureCollection](http://geojson.org/geojson-spec.html#feature-collection-objects)&lt;[Polygon](http://geojson.org/geojson-spec.html#polygon)>** grid of polygons with a property field `IDW`


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


