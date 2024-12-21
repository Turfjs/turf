## Installation

### In Node.js

```bash
# get all of turf
npm install @turf/turf

# or get individual packages
npm install @turf/helpers
npm install @turf/buffer
```

### In browser

Download the [minified file](https://npmcdn.com/@turf/turf/turf.min.js), and include it in a script tag. This will expose a global variable named `turf`.

```html
<script src="turf.min.js" charset="utf-8"></script>
```

You can also include it directly from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js"></script>
```

### TypeScript

Turf modules ship with type definitions packaged in each module. No DefinitelyTyped packages required.

The types defining the GeoJSON specification are maintained separately (Geometry, Polygon, etc). To refer to these in your own code, install `@types/geojson` and import from there:

```typescript
import { type Polygon } from "geojson";
```

### Other languages

[Turf ports and GIS alternatives](SEE_ALSO.md).


## Data in Turf

Turf uses <a href='https://geojson.org/'>GeoJSON</a> for all geographic data. Turf expects the data to be standard <a href='https://en.wikipedia.org/wiki/World_Geodetic_System'>WGS84</a> longitude, latitude coordinates. Check out <a href='https://geojson.io/#id=gist:anonymous/844f013aae8354eb889c&map=12/38.8955/-77.0135'>geojson.io</a> for a tool to easily create this data.

> **NOTE:** Turf expects data in (longitude, latitude) order per the GeoJSON standard.

Most Turf functions work with GeoJSON features. These are pieces of data that represent a collection of properties (ie: population, elevation, zipcode, etc.) along with a geometry. GeoJSON has several geometry types such as:

* Point
* LineString
* Polygon

Turf provides a few geometry functions of its own. These are nothing more than simple (and optional) wrappers that output plain old GeoJSON. For example, these two methods of creating a point are functionally equivalent:

```js
// Note order: longitude, latitude.
var point1 = turf.point([-73.988214, 40.749128]);

var point2 = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    // Note order: longitude, latitude.
    coordinates: [-73.988214, 40.749128]
  },
  properties: {}
};
```
