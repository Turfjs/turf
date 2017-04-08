import {Polygon, BBox} from '@turf/helpers'
import * as bboxClip from '../'

const bbox: BBox = [0, 0, 10, 10];
const poly: Polygon = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[2, 2], [8, 4], [12, 8], [3, 7], [2, 2]]]
  }
}
const clipped = bboxClip(poly, bbox);
