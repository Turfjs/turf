import Envelope from "../../geom/Envelope";

export default class MonotoneChain {
  constructor(pts, start, end, context) {
    this._env = null;
    this._id = null;
    this._pts = pts;
    this._start = start;
    this._end = end;
    this._context = context;
  }
  getLineSegment(index, ls) {
    ls.p0 = this._pts[index];
    ls.p1 = this._pts[index + 1];
  }
  computeSelect(searchEnv, start0, end0, mcs) {
    const p0 = this._pts[start0];
    const p1 = this._pts[end0];
    mcs.tempEnv1.init(p0, p1);
    if (end0 - start0 === 1) {
      mcs.select(this, start0);
      return null;
    }
    if (!searchEnv.intersects(mcs.tempEnv1)) return null;
    const mid = Math.trunc((start0 + end0) / 2);
    if (start0 < mid) {
      this.computeSelect(searchEnv, start0, mid, mcs);
    }
    if (mid < end0) {
      this.computeSelect(searchEnv, mid, end0, mcs);
    }
  }
  getCoordinates() {
    const coord = new Array(this._end - this._start + 1).fill(null);
    let index = 0;
    for (let i = this._start; i <= this._end; i++) {
      coord[index++] = this._pts[i];
    }
    return coord;
  }
  computeOverlaps(mc, mco) {
    this.computeOverlapsInternal(
      this._start,
      this._end,
      mc,
      mc._start,
      mc._end,
      mco
    );
  }
  setId(id) {
    this._id = id;
  }
  select(searchEnv, mcs) {
    this.computeSelect(searchEnv, this._start, this._end, mcs);
  }
  getEnvelope() {
    if (this._env === null) {
      const p0 = this._pts[this._start];
      const p1 = this._pts[this._end];
      this._env = new Envelope(p0, p1);
    }
    return this._env;
  }
  getEndIndex() {
    return this._end;
  }
  getStartIndex() {
    return this._start;
  }
  getContext() {
    return this._context;
  }
  getId() {
    return this._id;
  }
  computeOverlapsInternal(start0, end0, mc, start1, end1, mco) {
    const p00 = this._pts[start0];
    const p01 = this._pts[end0];
    const p10 = mc._pts[start1];
    const p11 = mc._pts[end1];
    if (end0 - start0 === 1 && end1 - start1 === 1) {
      mco.overlap(this, start0, mc, start1);
      return null;
    }
    mco.tempEnv1.init(p00, p01);
    mco.tempEnv2.init(p10, p11);
    if (!mco.tempEnv1.intersects(mco.tempEnv2)) return null;
    const mid0 = Math.trunc((start0 + end0) / 2);
    const mid1 = Math.trunc((start1 + end1) / 2);
    if (start0 < mid0) {
      if (start1 < mid1)
        this.computeOverlapsInternal(start0, mid0, mc, start1, mid1, mco);
      if (mid1 < end1)
        this.computeOverlapsInternal(start0, mid0, mc, mid1, end1, mco);
    }
    if (mid0 < end0) {
      if (start1 < mid1)
        this.computeOverlapsInternal(mid0, end0, mc, start1, mid1, mco);
      if (mid1 < end1)
        this.computeOverlapsInternal(mid0, end0, mc, mid1, end1, mco);
    }
  }
}
