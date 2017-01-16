import * as kinks from '../'

// Define variables
const hourglassCoordinates = [
  [
    [
      -12.034835815429688,
      8.901183448260598
    ],
    [
      -12.060413360595701,
      8.899826693726117
    ],
    [
      -12.036380767822266,
      8.873199368734273
    ],
    [
      -12.059383392333983,
      8.871418491385919
    ],
    [
      -12.034835815429688,
      8.901183448260598
    ]
  ]
];
const hourglassLineString: GeoJSON.LineString = {
  type: "LineString",
  coordinates: hourglassCoordinates[0]
}
const hourglassMultiLineString: GeoJSON.MultiLineString = {
  type: "MultiLineString",
  coordinates: hourglassCoordinates
}
const hourglassFeatureLineString: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {},
  geometry: hourglassLineString
}
const hourglassFeatureMultiLineString: GeoJSON.Feature<GeoJSON.MultiLineString> = {
  type: 'Feature',
  properties: {},
  geometry: hourglassMultiLineString
}

// Test Types
kinks(hourglassLineString)
kinks(hourglassMultiLineString)
kinks(hourglassFeatureLineString)
kinks(hourglassFeatureMultiLineString)
