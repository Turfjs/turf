import { Coord, Feature, FeatureCollection, Point } from '../helpers';
export interface NearestPoint extends Feature<Point> {
    properties: {
        featureIndex: number;
        distanceToPoint: number;
        [key: string]: any;
    };
}
/**
 * Takes a reference {@link Point|point} and a FeatureCollection of Features
 * with Point geometries and returns the
 * point from the FeatureCollection closest to the reference. This calculation
 * is geodesic.
 *
 * @name nearestPoint
 * @param {Coord} targetPoint the reference point
 * @param {FeatureCollection<Point>} points against input point set
 * @returns {Feature<Point>} the closest point in the set to the reference point
 * @example
 * var targetPoint = turf.point([28.965797, 41.010086], {"marker-color": "#0F0"});
 * var points = turf.featureCollection([
 *     turf.point([28.973865, 41.011122]),
 *     turf.point([28.948459, 41.024204]),
 *     turf.point([28.938674, 41.013324])
 * ]);
 *
 * var nearest = turf.nearestPoint(targetPoint, points);
 *
 * //addToMap
 * var addToMap = [targetPoint, points, nearest];
 * nearest.properties['marker-color'] = '#F00';
 */
declare function nearestPoint(targetPoint: Coord, points: FeatureCollection<Point>): NearestPoint;
export default nearestPoint;
