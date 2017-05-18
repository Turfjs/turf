import {point} from '@turf/helpers';
import * as sector from './';

const center = point([-75.343, 39.984]);
const unit = 'kilometers';
const bearing1 = 10;
const bearing2 = -30;
const radius = 5;
const steps = 10;

sector(center, radius, bearing1, bearing2);
sector(center, radius, bearing1, bearing2, steps);
sector(center, radius, bearing1, bearing2, steps, unit);