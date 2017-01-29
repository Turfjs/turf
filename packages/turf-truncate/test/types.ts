import * as truncate from '../'

const points: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          70.46923055566859,
          58.11088890802906
        ]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -435.69979190826416,
          45.42502188406042
        ]
      }
    }
  ]
}
const point: GeoJSON.Feature<GeoJSON.Point> = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [
      70.46923055566859,
      58.11088890802906,
      3012
    ]
  },
  "properties": {}
}

truncate(point, 6)
truncate(point)
truncate(point, 3, 2)
truncate(points, 6)
truncate(points)

