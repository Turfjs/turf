# turf-within

# within

Takes a set of [points](Point) and a set of [polygons](Polygon) and returns the points that fall within the polygons.

**Parameters**

-   `points` **FeatureCollection&lt;Point>** input points
-   `polygons` **FeatureCollection&lt;Polygon>** input polygons

**Examples**

```javascript
var searchWithin = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-46.653,-23.543],
          [-46.634,-23.5346],
          [-46.613,-23.543],
          [-46.614,-23.559],
          [-46.631,-23.567],
          [-46.653,-23.560],
          [-46.653,-23.543]
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
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6318, -23.5523]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6246, -23.5325]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.6062, -23.5513]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.663, -23.554]
      }
    }, {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [-46.643, -23.557]
      }
    }
  ]
};

var ptsWithin = turf.within(points, searchWithin);

//=points

//=searchWithin

//=ptsWithin
```

Returns **FeatureCollection&lt;Point>** points that land within at least one polygon

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-within
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
