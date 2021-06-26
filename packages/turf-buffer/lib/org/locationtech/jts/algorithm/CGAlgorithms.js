import Location from "../geom/Location";
import IllegalArgumentException from "../../../../java/lang/IllegalArgumentException";
import CGAlgorithmsDD from "./CGAlgorithmsDD";
import Envelope from "../geom/Envelope";
import RayCrossingCounter from "./RayCrossingCounter";
import { coordinates } from "../../../../utils/coordinates";

export default class CGAlgorithms {
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q
   */
  static orientationIndex(p1, p2, q) {
    return CGAlgorithmsDD.orientationIndex(p1, p2, q);
  }
  /**
   *
   * @param {GeoJSONCoordinate} A
   * @param {GeoJSONCoordinate} B
   * @param {GeoJSONCoordinate} C
   * @param {GeoJSONCoordinate} D
   */
  static distanceLineLine(A, B, C, D) {
    const [ax, ay] = A,
      [bx, by] = B,
      [cx, cy] = C,
      [dx, dy] = D;

    if (coordinates.equals(A, B))
      return CGAlgorithms.distancePointLine(A, C, D);
    if (coordinates.equals(C, D))
      return CGAlgorithms.distancePointLine(D, A, B);
    let noIntersection = false;
    if (!Envelope.intersects(...arguments)) {
      noIntersection = true;
    } else {
      const denom = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
      if (denom === 0) {
        noIntersection = true;
      } else {
        const rNumb = (ay - cy) * (dx - cx) - (ax - cx) * (dy - cy);
        const sNum = (ay - cy) * (bx - ax) - (ax - cx) * (by - ay);
        const s = sNum / denom;
        const r = rNumb / denom;
        if (r < 0 || r > 1 || s < 0 || s > 1) {
          noIntersection = true;
        }
      }
    }
    if (noIntersection) {
      return Math.min(
        CGAlgorithms.distancePointLine(A, C, D),
        CGAlgorithms.distancePointLine(B, C, D),
        CGAlgorithms.distancePointLine(C, A, B),
        CGAlgorithms.distancePointLine(D, A, B)
      );
    }
    return 0.0;
  }
  static isPointInRing(p, ring) {
    return CGAlgorithms.locatePointInRing(p, ring) !== Location.EXTERIOR;
  }
  static isCCW(ring) {
    const nPts = ring.length - 1;
    if (nPts < 3)
      throw new IllegalArgumentException(
        "Ring has fewer than 4 points, so orientation cannot be determined"
      );
    let hiPt = [...ring[0]];
    let hiIndex = 0;
    for (let i = 1; i <= nPts; i++) {
      const p = [...ring[i]];
      if (p[1] > hiPt[1]) {
        hiPt = [...p];
        hiIndex = i;
      }
    }
    let iPrev = hiIndex;
    do {
      iPrev = iPrev - 1;
      if (iPrev < 0) iPrev = nPts;
    } while (coordinates.equals(ring[iPrev], hiPt) && iPrev !== hiIndex);
    let iNext = hiIndex;
    do {
      iNext = (iNext + 1) % nPts;
    } while (coordinates.equals(ring[iNext], hiPt) && iNext !== hiIndex);
    const prev = [...ring[iPrev]];
    const next = [...ring[iNext]];
    if (
      coordinates.equals(prev, hiPt) ||
      coordinates.equals(next, hiPt) ||
      coordinates.equals(prev, next)
    )
      return false;
    const disc = CGAlgorithms.computeOrientation(prev, hiPt, next);
    let isCCW = false;
    if (disc === 0) {
      isCCW = prev[0] > next[0];
    } else {
      isCCW = disc > 0;
    }
    return isCCW;
  }
  static locatePointInRing(p, ring) {
    return RayCrossingCounter.locatePointInRing(p, ring);
  }
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q
   */
  static computeOrientation(p1, p2, q) {
    return CGAlgorithms.orientationIndex(p1, p2, q);
  }

  /**
   *
   * @param {GeoJSONCoordinate} p
   * @param {GeoJSONCoordinate} A
   * @param {GeoJSONCoordinate} B
   */
  static distancePointLine(p, A, B) {
    const [px, py] = p,
      [ax, ay] = A,
      [bx, by] = B;

    if (ax === bx && ay === by) return coordinates.distance(p, A);
    const len2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
    const r = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / len2;
    if (r <= 0.0) return coordinates.distance(p, A);
    if (r >= 1.0) return coordinates.distance(p, B);
    const s = ((ay - py) * (bx - ax) - (ax - px) * (by - ay)) / len2;
    return Math.abs(s) * Math.sqrt(len2);
  }
  static get CLOCKWISE() {
    return -1;
  }
  static get COUNTERCLOCKWISE() {
    return 1;
  }
}
