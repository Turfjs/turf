import {Polygon, MultiPolygon} from '@turf/helpers'
import * as polygonToLineString from '../'

const poly: Polygon = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]]
  }
}

const multiPoly: MultiPolygon = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]],
      [[[135, -40], [155, -40], [155, -30], [135, -30], [135, -40]]]
    ]
  }
}

const feature = polygonToLineString(poly);
const collection = polygonToLineString(multiPoly);
