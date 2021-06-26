export default class DD {
  constructor(hi, lo = 0.0) {
    this._hi = hi;
    this._lo = lo;
  }
  selfSubtract(y) {
    if (Number.isNaN(this._hi)) return this;
    return this.selfAdd(-y._hi, -y._lo);
  }
  selfAdd(yhi, ylo) {
    if (arguments.length === 1) {
      const y = arguments[0];
      if (y instanceof DD) {
        return this.selfAdd(y._hi, y._lo);
      } else if (typeof y === "number") {
        let S, e, s, f, H, h;
        S = this._hi + y;
        e = S - this._hi;
        s = S - e;
        s = y - e + (this._hi - s);
        f = s + this._lo;
        H = S + f;
        h = f + (S - H);
        this._hi = H + h;
        this._lo = h + (H - this._hi);
        return this;
      }
    }
    let S, T, e, f, s, t, H, h;
    S = this._hi + yhi;
    T = this._lo + ylo;
    e = S - this._hi;
    f = T - this._lo;
    s = S - e;
    t = T - f;
    s = yhi - e + (this._hi - s);
    t = ylo - f + (this._lo - t);
    e = s + T;
    H = S + e;
    h = e + (S - H);
    e = t + h;
    var zhi = H + e;
    var zlo = e + (H - zhi);
    this._hi = zhi;
    this._lo = zlo;
    return this;
  }
  selfMultiply(dd) {
    const yhi = dd._hi;
    const ylo = dd._lo;
    let C, hx, c, tx, hy, ty, zhi, zlo;
    C = DD.SPLIT * this._hi;
    hx = C - this._hi;
    c = DD.SPLIT * yhi;
    hx = C - hx;
    tx = this._hi - hx;
    hy = c - yhi;
    C = this._hi * yhi;
    hy = c - hy;
    ty = yhi - hy;
    c =
      hx * hy -
      C +
      hx * ty +
      tx * hy +
      tx * ty +
      (this._hi * ylo + this._lo * yhi);
    zhi = C + c;
    hx = C - zhi;
    zlo = c + hx;
    this._hi = zhi;
    this._lo = zlo;
    return this;
  }
  signum() {
    if (this._hi > 0) return 1;
    if (this._hi < 0) return -1;
    if (this._lo > 0) return 1;
    if (this._lo < 0) return -1;
    return 0;
  }
  static get SPLIT() {
    return 134217729.0;
  } // DD
}
