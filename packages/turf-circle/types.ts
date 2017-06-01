import {point} from '@turf/helpers'
import * as circle from './'

const center = point([-75.343, 39.984]);
const unit = 'kilometers';
const radius = 5;
const steps = 10;

circle(center, radius);
circle(center, radius, steps);
circle(center, radius, steps, unit);
circle([-75, 39], radius, steps, unit, {foo: 'bar'});