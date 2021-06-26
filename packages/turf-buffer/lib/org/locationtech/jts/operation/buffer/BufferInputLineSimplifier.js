import CGAlgorithms from "../../algorithm/CGAlgorithms";

export default class BufferInputLineSimplifier {
  constructor(inputLine) {
    this._distanceTol = null;
    this._isDeleted = [];
    this._angleOrientation = CGAlgorithms.COUNTERCLOCKWISE;
    this._inputLine = inputLine || null;
  }
  _isDeletable(i0, i1, i2, distanceTol) {
    const p0 = this._inputLine[i0];
    const p1 = this._inputLine[i1];
    const p2 = this._inputLine[i2];
    if (!this._isConcave(p0, p1, p2)) return false;
    if (!this._isShallow(p0, p1, p2, distanceTol)) return false;
    return this._isShallowSampled(p0, p1, i0, i2, distanceTol);
  }
  _deleteShallowConcavities() {
    let index = 1;
    // const maxIndex = this._inputLine.length - 1;
    let midIndex = this._findNextNonDeletedIndex(index);
    let lastIndex = this._findNextNonDeletedIndex(midIndex);
    let isChanged = false;
    while (lastIndex < this._inputLine.length) {
      let isMiddleVertexDeleted = false;
      if (this._isDeletable(index, midIndex, lastIndex, this._distanceTol)) {
        this._isDeleted[midIndex] = BufferInputLineSimplifier.DELETE;
        isMiddleVertexDeleted = true;
        isChanged = true;
      }
      if (isMiddleVertexDeleted) index = lastIndex;
      else index = midIndex;
      midIndex = this._findNextNonDeletedIndex(index);
      lastIndex = this._findNextNonDeletedIndex(midIndex);
    }
    return isChanged;
  }
  _isShallowSampled(p0, p2, i0, i2, distanceTol) {
    let inc = Math.trunc(
      (i2 - i0) / BufferInputLineSimplifier.NUM_PTS_TO_CHECK
    );
    if (inc <= 0) inc = 1;
    for (let i = i0; i < i2; i += inc) {
      if (!this._isShallow(p0, p2, this._inputLine[i], distanceTol))
        return false;
    }
    return true;
  }
  _isConcave(p0, p1, p2) {
    const orientation = CGAlgorithms.computeOrientation(p0, p1, p2);
    const isConcave = orientation === this._angleOrientation;
    return isConcave;
  }
  simplify(distanceTol) {
    this._distanceTol = Math.abs(distanceTol);
    if (distanceTol < 0) this._angleOrientation = CGAlgorithms.CLOCKWISE;
    this._isDeleted = [];
    let isChanged = false;
    do {
      isChanged = this._deleteShallowConcavities();
    } while (isChanged);
    return this._collapseLine();
  }
  _findNextNonDeletedIndex(index) {
    let next = index + 1;
    while (
      next < this._inputLine.length &&
      this._isDeleted[next] === BufferInputLineSimplifier.DELETE
    )
      next++;
    return next;
  }
  _isShallow(p0, p1, p2, distanceTol) {
    const dist = CGAlgorithms.distancePointLine(p1, p0, p2);
    return dist < distanceTol;
  }
  _collapseLine() {
    const coordList = [];
    for (let i = 0; i < this._inputLine.length; i++) {
      if (this._isDeleted[i] !== BufferInputLineSimplifier.DELETE)
        coordList.push(this._inputLine[i]);
    }
    return coordList;
  }
  static simplify(inputLine, distanceTol) {
    const simp = new BufferInputLineSimplifier(inputLine);
    return simp.simplify(distanceTol);
  }

  static get DELETE() {
    return 1;
  }

  static get NUM_PTS_TO_CHECK() {
    return 10;
  }
}
