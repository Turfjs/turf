import { FeatureCollection, LineString, Geometry, Feature, Point, featureCollection, Coord, point, geometry, lineString } from '@turf/helpers';
import { featureEach, segmentEach, segmentReduce } from '@turf/meta';
import bearing from '@turf/bearing';
import length from '@turf/length';
import centroid from '@turf/centroid';
import { getCoord } from '@turf/invariant';
import destination from '@turf/destination';

/**
 * get euclidean distance between two points.
 * @name euclideanDistance
 * @param coords 
 */
function euclideanDistance(coords: number[][]) {
    let [x0, y0]: number[] = coords[0];
    let [x1, y1]: number[] = coords[1];
    let dx: number = x1 - x0;
    let dy: number = y1 - y0;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

/**
 * get the length of a LineString, both in projected or geographical coordinate system.
 * @name getLengthOfLineString
 * @param {Feature<LineString>} line 
 * @param {boolean} isPlanar 
 */
function getLengthOfLineString(line: Feature<LineString>, isPlanar: boolean) {
    if (isPlanar) {
        return segmentReduce<number>(line, (previousValue?: number, segment?: Feature<LineString>): number => {
            let coords = segment.geometry.coordinates;// the signatrue of segmentReduce has problem ?
            return previousValue + euclideanDistance(coords);
        }, 0);
    } else {
        return length(line, {
            units: 'meters'
        });
    }
}


// bearing to xy(from due earth counterclockwise 0-180)
function bearingToCartesian(angle: number): number {
    let result = 90 - angle;
    if (result > 180) {
        result -= 360;
    }
    return result;
}

/**
 * @name getCosAndSin
 * @param {number[][]} coordinates
 * @returns {[number, number]}
 */
function getCosAndSin(coordinates: number[][], isPlanar: boolean): [number, number] {
    let beginPoint: number[] = coordinates[0];
    let endPoint: number[] = coordinates[coordinates.length - 1]
    if (isPlanar) {
        let [x0, y0]: number[] = beginPoint;
        let [x1, y1]: number[] = endPoint;
        let dx: number = x1 - x0;
        let dy: number = y1 - y0;
        let h = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (h < 0.000000001) {
            return [NaN, NaN];
        }
        let sin1 = dy / h;
        let cos1 = dx / h;
        return [sin1, cos1];
    } else {
        let angle = bearingToCartesian(bearing(beginPoint, endPoint));
        let radian = angle * Math.PI / 180;
        return [Math.sin(radian), Math.cos(radian)];
    }

}

function getAngleBySinAndCos(sin1: number, cos1: number): number {
    let angle: number = 0;
    if (Math.abs(cos1) < 0.000000001) {
        angle = 90;
    } else {
        angle = Math.atan2(sin1, cos1) * 180 / Math.PI;
    }
    if (sin1 >= 0) {
        if (cos1 < 0) {
            angle += 180;
        }
    } else {
        if (cos1 < 0) {
            angle -= 180;
        }
    }
    return angle;
}

function getCircularVariance(sin1: number, cos1: number, len: number) {
    if (len == 0) {
        throw new Error('the size of the features set must be greater than 0');
    }
    return 1 - (Math.sqrt(Math.pow(sin1, 2) + Math.pow(cos1, 2)) / len);
}

function getMeanLineString(centroidOfLine: number[], angle: number, lenOfLine: number, isPlanar: boolean) {
    if (isPlanar) {
        let [averageX, averageY]: number[] = centroidOfLine;
        let begin_x: number;
        let begin_y: number;
        let end_x: number;
        let end_y: number;
        let r: number = angle * Math.PI / 180;
        let sin: number = Math.sin(r);
        let cos: number = Math.cos(r);
        begin_x = averageX - lenOfLine / 2 * cos;
        begin_y = averageY - lenOfLine / 2 * sin;
        end_x = averageX + lenOfLine / 2 * cos;
        end_y = averageY + lenOfLine / 2 * sin;
        return [
            [begin_x, begin_y],
            [end_x, end_y],
        ]
    } else {
        let end = destination(point(centroidOfLine), lenOfLine / 2, angle, { units: 'meters' });
        let begin = destination(point(centroidOfLine), -lenOfLine / 2, angle, { units: 'meters' });
        return [
            getCoord(begin), getCoord(end)
        ]
    }

}


/**
 * @name directionalMean
 * This module calculate the average angle of a set of lines, measuring the trend of it.
 * It can be used in both project coordinate system and geography coordinate system.
 * It can handle segments of line or the whole line.
 * 
 * @param {FeatureCollection<LineString>} lines
 * @param {object} [options={}]
 * @param {boolean} [options.planar=true] whether the spatial reference system is projected or geographical.
 * @param {boolean} [options.segment=false] whether treat a LineString as a whole or a set of segments.
 * @returns {DirectionalMeanLine}
 * @example
 * const outGpsJsonPath1 = path.join(__dirname, 'test', 'out', 'bus_route_gps1.json');
 * let gpsResult1 = directionalMean(gpsGeojson, {
 *   planar: false
 *  });
 * 
 */
export default function directionalMean(lines: FeatureCollection<LineString>, options: {
    planar?: boolean;
    segment?: boolean;
} = {}): DirectionalMeanLine {

    let isPlanar: boolean = !!options.planar; // you can't use options.planar || true here.
    let isSegment: boolean = options.segment || false;
    let sigmaSin: number = 0;
    let sigmaCos: number = 0;
    let countOfLines: number = 0;
    let sumOfLen: number = 0;
    let centroidList: Array<Feature<Point>> = [];

    if (isSegment) {
        segmentEach(lines, (currentSegment: any) => { // todo fix turf-meta's declaration file
            let [sin1, cos1]: [number, number] = getCosAndSin(currentSegment.geometry.coordinates, isPlanar);
            let lenOfLine = getLengthOfLineString(currentSegment, isPlanar);
            if (isNaN(sin1) || isNaN(cos1)) {
                return;
            } else {
                sigmaSin += sin1;
                sigmaCos += cos1;
                countOfLines += 1;
                sumOfLen += lenOfLine;
                centroidList.push(centroid(currentSegment));
            }
        });
        // planar and segment
    } else {
        // planar and non-segment
        featureEach(lines, (currentFeature: Feature<LineString>, featureIndex: number) => {
            if (currentFeature.geometry.type !== 'LineString') {
                throw new Error('shold to support MultiLineString?')
            }
            let [sin1, cos1]: [number, number] = getCosAndSin(currentFeature.geometry.coordinates, isPlanar);
            let lenOfLine = getLengthOfLineString(currentFeature, isPlanar);
            if (isNaN(sin1) || isNaN(cos1)) {
                return;
            } else {
                sigmaSin += sin1;
                sigmaCos += cos1;
                countOfLines += 1;
                sumOfLen += lenOfLine;
                centroidList.push(centroid(currentFeature));
            }
        });
    }


    let cartesianAngle: number = getAngleBySinAndCos(sigmaSin, sigmaCos);
    let bearingAngle: number = bearingToCartesian(cartesianAngle);
    let circularVariance = getCircularVariance(sigmaSin, sigmaCos, countOfLines);
    let averageLength = sumOfLen / countOfLines;
    let centroidOfLines = centroid(featureCollection(centroidList));
    let [averageX, averageY]: number[] = getCoord(centroidOfLines);
    let meanLinestring;
    if (isPlanar) {
        meanLinestring = getMeanLineString([averageX, averageY], cartesianAngle, averageLength, isPlanar);
    } else {
        meanLinestring = getMeanLineString([averageX, averageY], bearingAngle, averageLength, isPlanar);
    }

    return lineString(meanLinestring, {
        cartesianAngle,
        bearingAngle,
        circularVariance,
        averageX,
        averageY,
        averageLength,
        countOfLines,
    })


}



/**
 * @type {interface} DirectionalMeanLine
 * @property {number} cartesianAngle the mean angle of all lines. (measure from due earth counterclockwise).
 * @property {number} bearingAngle the mean angle of all lines. (bearing).
 * @property {number} circularVariance the extent to which features all point in the same direction.
 *  the value ranges 0-1, the bigger the value, the more variation in directions between lines.
 * @property {number} averageX the centroid of all lines.
 * @property {number} averageY the centroid of all line.
 * @property {number} averageLength the average length of line.
 * @property {number} countOfLines the count of features.
 */
export interface DirectionalMeanLine extends Feature<LineString> {
    properties: {
        cartesianAngle: number;
        bearingAngle: number;
        circularVariance: number;
        averageX: number;
        averageY: number;
        averageLength: number;
        countOfLines: number;
        [key: string]: any;
    };
}