import MonotoneChain from "./MonotoneChain";
import Quadrant from "../../geomgraph/Quadrant";
import { coordinates } from "../../../../../utils/coordinates";

export default class MonotoneChainBuilder {
  static getChainStartIndices(pts) {
    let start = 0;
    const startIndexList = [];
    startIndexList.push(start);
    do {
      const last = MonotoneChainBuilder.findChainEnd(pts, start);
      startIndexList.push(last);
      start = last;
    } while (start < pts.length - 1);
    return startIndexList;
  }
  static findChainEnd(pts, start) {
    let safeStart = start;
    while (
      safeStart < pts.length - 1 &&
      coordinates.equals(pts[safeStart], pts[safeStart + 1])
    ) {
      safeStart++;
    }
    if (safeStart >= pts.length - 1) {
      return pts.length - 1;
    }
    const chainQuad = Quadrant.quadrant(pts[safeStart], pts[safeStart + 1]);
    let last = start + 1;
    while (last < pts.length) {
      if (!coordinates.equals(pts[last - 1], pts[last])) {
        const quad = Quadrant.quadrant(pts[last - 1], pts[last]);
        if (quad !== chainQuad) break;
      }
      last++;
    }
    return last - 1;
  }
  static getChains(pts, context) {
    const mcList = [];
    const startIndex = MonotoneChainBuilder.getChainStartIndices(pts);
    for (let i = 0; i < startIndex.length - 1; i++) {
      const mc = new MonotoneChain(
        pts,
        startIndex[i],
        startIndex[i + 1],
        context
      );
      mcList.push(mc);
    }
    return mcList;
  }
}
