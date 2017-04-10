import {Polygon} from '@turf/helpers'
import * as polygonToLineString from '../'

 var poly: Polygon = {
   'type': 'Feature',
   'properties': {},
   'geometry': {
     'type': 'Polygon',
     'coordinates': [[[125, -30], [145, -30], [145, -20], [125, -20], [125, -30]]
     ]
   }
 }
 var line = polygonToLineString(poly);