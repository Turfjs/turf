# turf-centroid

# centroid

Takes one or more features and calculates the centroid using
the mean of all vertices.
This lessens the effect of small islands and artifacts when calculating
the centroid of a set of polygons.

**Parameters**

-   `features` **(Feature | FeatureCollection)** input features

**Examples**

```javascript
var poly = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [105.818939,21.004714],
      [105.818939,21.061754],
      [105.890007,21.061754],
      [105.890007,21.004714],
      [105.818939,21.004714]
    ]]
  }
};

var centroidPt = turf.centroid(poly);

var result = {
  "type": "FeatureCollection",
  "features": [poly, centroidPt]
};

//=result
```

Returns **Feature&lt;Point>** the centroid of the input features

---

This module is part of the [Turfjs project](http://turfjs.org/), an open source
module collection dedicated to geographic algorithms. It is maintained in the
[Turfjs/turf](https://github.com/Turfjs/turf) repository, where you can create
PRs and issues.

### Installation

Install this module individually:

```sh
$ npm install turf-centroid
```

Or install the Turf module that includes it as a function:

```sh
$ npm install turf
```
