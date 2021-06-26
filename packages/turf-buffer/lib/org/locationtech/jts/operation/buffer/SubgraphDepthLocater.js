import CGAlgorithms from "../../algorithm/CGAlgorithms";
import Position from "../../geomgraph/Position";
import LineSegment from "../../geom/LineSegment";
import { coordinates, x, y } from "../../../../../utils/coordinates";

export default class SubgraphDepthLocater {
  constructor(subgraphs) {
    this._seg = new LineSegment();
    this._subgraphs = subgraphs;
  }
  _findStabbedSegments(point) {
    const stabbingRayLeftPt = point;
    const stabbedSegments = [];
    // bsg is BufferSubgraph
    this._subgraphs.forEach((bsg) => {
      const env = bsg.getEnvelope();
      if (
        y(stabbingRayLeftPt) < env.getMinY() ||
        y(stabbingRayLeftPt) > env.getMaxY()
      )
        return;
      const dirEdges = bsg.getDirectedEdges();
      dirEdges.forEach((dirEdge) => {
        if (!dirEdge.isForward()) return;
        const pts = dirEdge.getEdge().getCoordinates();
        for (let i = 0; i < pts.length - 1; i++) {
          this._seg.p0 = pts[i];
          this._seg.p1 = pts[i + 1];
          if (y(this._seg.p0) > y(this._seg.p1)) this._seg.reverse();
          const maxx = Math.max(x(this._seg.p0), x(this._seg.p1));
          if (maxx < x(stabbingRayLeftPt)) continue;
          if (this._seg.isHorizontal()) continue;
          if (
            y(stabbingRayLeftPt) < y(this._seg.p0) ||
            y(stabbingRayLeftPt) > y(this._seg.p1)
          )
            continue;
          if (
            CGAlgorithms.computeOrientation(
              [x(this._seg.p0), y(this._seg.p0)],
              [x(this._seg.p1), y(this._seg.p1)],
              [x(stabbingRayLeftPt), y(stabbingRayLeftPt)]
            ) === CGAlgorithms.CLOCKWISE
          )
            continue;
          let depth = dirEdge.getDepth(Position.LEFT);
          if (!coordinates.equals(this._seg.p0, pts[i]))
            depth = dirEdge.getDepth(Position.RIGHT);
          const ds = new DepthSegment(this._seg.p0, this._seg.p1, depth);
          stabbedSegments.push(ds);
        }
      });
    });
    return stabbedSegments;
  }
  getDepth(point) {
    const stabbedSegments = this._findStabbedSegments(point);
    if (stabbedSegments.length === 0) return 0;
    const ds = stabbedSegments.sort((a, b) => a.compareTo(b)).shift();
    return ds._leftDepth;
  }
}

class DepthSegment {
  constructor(p0, p1, depth) {
    this._upwardSeg = new LineSegment(p0, p1);
    this._leftDepth = depth;
  }
  compareTo(obj) {
    const other = obj;
    if (this._upwardSeg.minX() >= other._upwardSeg.maxX()) return 1;
    if (this._upwardSeg.maxX() <= other._upwardSeg.minX()) return -1;
    let orientIndex = this._upwardSeg.orientationIndex(other._upwardSeg);
    if (orientIndex !== 0) return orientIndex;
    orientIndex = -1 * other._upwardSeg.orientationIndex(this._upwardSeg);
    if (orientIndex !== 0) return orientIndex;
    return this._upwardSeg.compareTo(other._upwardSeg);
  }
}
