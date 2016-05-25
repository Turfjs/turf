# turf-line-slice-along

create line segment based on start and end distance on a given line string


### `turf.lineSliceAlong(line, dist1, dist2, [units=kilometers])`

Takes a LineString|line, a specified distance along the line to a start Point,
and a specified  distance along the line to a stop point
and returns a subsection of the line in-between those points.

This can be useful for extracting only the part of a route between two distances.

### Parameters

| parameter            | type                    | description                                               |
| -------------------- | ----------------------- | --------------------------------------------------------- |
| `line`               | Feature\.\<LineString\> | input line                                                |
| `dist1`              | Number                  | distance along the line to starting point                 |
| `dist2`              | Number                  | distance along the line to ending point                   |
| `[units=kilometers]` | String                  | _optional:_ can be degrees, radians, miles, or kilometers |


### Example

```js
var line = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
       [ 7.66845703125, 45.058001435398296 ],
      [ 9.20654296875, 45.460130637921004 ],
      [ 11.348876953125, 44.48866833139467 ],
      [ 12.1728515625, 45.43700828867389 ],
      [ 12.535400390625, 43.98491011404692 ],
      [ 12.425537109375, 41.86956082699455 ],
      [ 14.2437744140625, 40.83874913796459 ],
      [ 14.765625, 40.681679458715635 ]
    ]
  }
};
var start = 12.5;

var stop = 25;

var units = 'miles';

var sliced = turf.lineSliceAlong(start, stop, line, units);

//=line

//=sliced
```


**Returns** `Feature.<LineString>`, sliced line

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install jvrousseau/turf-line-slice-along
```

## Tests

```sh
$ npm test
```
