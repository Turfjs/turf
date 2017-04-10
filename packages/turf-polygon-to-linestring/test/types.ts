import {Polygon} from '@turf/helpers'
import * as polygonToLineString from '../'

const poly: Polygon = {
  'type': 'Feature',
  'properties': {},
  'geometry': {
    'type': 'Polygon',
    'coordinates': [[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]
    ]
  }
}
const line = polygonToLineString(poly);
