# turf-destination

# destination

Takes a [Point](Point) and calculates the location of a destination point given a distance in degrees, radians, miles, or kilometers; and bearing in degrees. This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.

**Parameters**

-   `from` **Feature&lt;Point>** starting point
-   `distance` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** distance from the starting point
-   `bearing` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** ranging from -180 to 180
-   `units` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** miles, kilometers, degrees, or radians (optional, default `kilometers`)

**Examples**

```javascript
var point = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-75.343, 39.984]
  }
};
var distance = 50;
var bearing = 90;
var units = 'miles';

var destination = turf.destination(point, distance, bearing, units);
destination.properties['marker-color'] = '#f00';

var result = {
  "type": "FeatureCollection",
  "features": [point, destination]
};

//=result
```

Returns **Feature&lt;Point>** destination point

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-destination
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
