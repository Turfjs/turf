# turf-circle

# circle

Takes a [Point](Point) and calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision.

**Parameters**

-   `center` **Feature&lt;Point>** center point
-   `radius` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** radius of the circle
-   `steps` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of steps
-   `units` **\[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** miles, kilometers, degrees, or radians (optional, default `kilometers`)

**Examples**

```javascript
var center = {
  "type": "Feature",
  "properties": {
    "marker-color": "#0f0"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-75.343, 39.984]
  }
};
var radius = 5;
var steps = 10;
var units = 'kilometers';

var circle = turf.circle(center, radius, steps, units);

var result = {
  "type": "FeatureCollection",
  "features": [center, circle]
};

//=result
```

Returns **Feature&lt;Polygon>** circle polygon

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-circle
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
