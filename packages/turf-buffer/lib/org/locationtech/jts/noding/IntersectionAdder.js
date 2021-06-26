export default class IntersectionAdder {
  constructor(li) {
    this._hasIntersection = false;
    this._isSelfIntersection = null;
    this.numIntersections = 0;
    this.numInteriorIntersections = 0;
    this.numProperIntersections = 0;
    this.numTests = 0;
    this._li = li;
  }
  _isTrivialIntersection(e0, segIndex0, e1, segIndex1) {
    if (e0 === e1) {
      if (this._li.getIntersectionNum() === 1) {
        if (IntersectionAdder.isAdjacentSegments(segIndex0, segIndex1))
          return true;
        if (e0.isClosed()) {
          const maxSegIndex = e0.size() - 1;
          if (
            (segIndex0 === 0 && segIndex1 === maxSegIndex) ||
            (segIndex1 === 0 && segIndex0 === maxSegIndex)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
  processIntersections(e0, segIndex0, e1, segIndex1) {
    if (e0 === e1 && segIndex0 === segIndex1) return null;
    this.numTests++;
    const p00 = e0.getCoordinates()[segIndex0];
    const p01 = e0.getCoordinates()[segIndex0 + 1];
    const p10 = e1.getCoordinates()[segIndex1];
    const p11 = e1.getCoordinates()[segIndex1 + 1];
    // IMPORTANT: Pass copy of coordinates here
    this._li.computeIntersection([...p00], [...p01], [...p10], [...p11]);
    if (this._li.hasIntersection()) {
      this.numIntersections++;
      if (this._li.isInteriorIntersection()) {
        this.numInteriorIntersections++;
      }
      if (!this._isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
        this._hasIntersection = true;
        e0.addIntersections(this._li, segIndex0, 0);
        e1.addIntersections(this._li, segIndex1, 1);
        if (this._li.isProper()) {
          this.numProperIntersections++;
        }
      }
    }
  }
  hasIntersection() {
    return this._hasIntersection;
  }
  static isAdjacentSegments(i1, i2) {
    return Math.abs(i1 - i2) === 1;
  }
}
