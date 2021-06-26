import { coordinates, x, y } from "../../../../utils/coordinates";

export default class Envelope {
  constructor() {
    this.init(...arguments);
  }
  equals(other) {
    if (!(other instanceof Envelope)) {
      return false;
    }
    var otherEnvelope = other;
    if (this.isNull()) {
      return otherEnvelope.isNull();
    }
    return (
      this._maxx === otherEnvelope.getMaxX() &&
      this._maxy === otherEnvelope.getMaxY() &&
      this._minx === otherEnvelope.getMinX() &&
      this._miny === otherEnvelope.getMinY()
    );
  }
  intersection(env) {
    if (this.isNull() || env.isNull() || !this.intersects(env))
      return new Envelope();
    var intMinX = this._minx > env._minx ? this._minx : env._minx;
    var intMinY = this._miny > env._miny ? this._miny : env._miny;
    var intMaxX = this._maxx < env._maxx ? this._maxx : env._maxx;
    var intMaxY = this._maxy < env._maxy ? this._maxy : env._maxy;
    return new Envelope(intMinX, intMaxX, intMinY, intMaxY);
  }
  isNull() {
    return this._maxx < this._minx;
  }
  getMaxX() {
    return this._maxx;
  }
  covers() {
    if (arguments.length === 1) {
      if (coordinates.isCoordinate(arguments[0])) {
        let p = arguments[0];
        return this.covers(x(p), y(p));
      } else if (arguments[0] instanceof Envelope) {
        let other = arguments[0];
        if (this.isNull() || other.isNull()) {
          return false;
        }
        return (
          other.getMinX() >= this._minx &&
          other.getMaxX() <= this._maxx &&
          other.getMinY() >= this._miny &&
          other.getMaxY() <= this._maxy
        );
      }
    } else if (arguments.length === 2) {
      const x = arguments[0];
      const y = arguments[1];
      if (this.isNull()) return false;
      return (
        x >= this._minx && x <= this._maxx && y >= this._miny && y <= this._maxy
      );
    }
  }
  intersects() {
    if (arguments.length === 1) {
      if (arguments[0] instanceof Envelope) {
        const other = arguments[0];
        if (this.isNull() || other.isNull()) {
          return false;
        }
        return !(
          other._minx > this._maxx ||
          other._maxx < this._minx ||
          other._miny > this._maxy ||
          other._maxy < this._miny
        );
      } else if (coordinates.isCoordinate(arguments[0])) {
        const p = arguments[0];
        return this.intersects(x(p), y(p));
      }
    } else if (arguments.length === 2) {
      const x = arguments[0];
      const y = arguments[1];
      if (this.isNull()) return false;
      return !(
        x > this._maxx ||
        x < this._minx ||
        y > this._maxy ||
        y < this._miny
      );
    }
  }
  getMinY() {
    return this._miny;
  }
  getMinX() {
    return this._minx;
  }
  expandToInclude() {
    if (arguments.length === 1) {
      if (coordinates.isCoordinate(arguments[0])) {
        let p = arguments[0];
        this.expandToInclude(x(p), y(p));
      } else if (arguments[0] instanceof Envelope) {
        let other = arguments[0];
        if (other.isNull()) {
          return null;
        }
        if (this.isNull()) {
          this._minx = other.getMinX();
          this._maxx = other.getMaxX();
          this._miny = other.getMinY();
          this._maxy = other.getMaxY();
        } else {
          if (other._minx < this._minx) {
            this._minx = other._minx;
          }
          if (other._maxx > this._maxx) {
            this._maxx = other._maxx;
          }
          if (other._miny < this._miny) {
            this._miny = other._miny;
          }
          if (other._maxy > this._maxy) {
            this._maxy = other._maxy;
          }
        }
      }
    } else if (arguments.length === 2) {
      const x = arguments[0];
      const y = arguments[1];
      if (this.isNull()) {
        this._minx = x;
        this._maxx = x;
        this._miny = y;
        this._maxy = y;
      } else {
        if (x < this._minx) {
          this._minx = x;
        }
        if (x > this._maxx) {
          this._maxx = x;
        }
        if (y < this._miny) {
          this._miny = y;
        }
        if (y > this._maxy) {
          this._maxy = y;
        }
      }
    }
  }
  getWidth() {
    if (this.isNull()) {
      return 0;
    }
    return this._maxx - this._minx;
  }
  compareTo(o) {
    var env = o;
    if (this.isNull()) {
      if (env.isNull()) return 0;
      return -1;
    } else {
      if (env.isNull()) return 1;
    }
    if (this._minx < env._minx) return -1;
    if (this._minx > env._minx) return 1;
    if (this._miny < env._miny) return -1;
    if (this._miny > env._miny) return 1;
    if (this._maxx < env._maxx) return -1;
    if (this._maxx > env._maxx) return 1;
    if (this._maxy < env._maxy) return -1;
    if (this._maxy > env._maxy) return 1;
    return 0;
  }
  translate(transX, transY) {
    if (this.isNull()) {
      return null;
    }
    this.init(
      this.getMinX() + transX,
      this.getMaxX() + transX,
      this.getMinY() + transY,
      this.getMaxY() + transY
    );
  }
  _setToNull() {
    this._minx = 0;
    this._maxx = -1;
    this._miny = 0;
    this._maxy = -1;
  }
  getHeight() {
    if (this.isNull()) {
      return 0;
    }
    return this._maxy - this._miny;
  }
  maxExtent() {
    if (this.isNull()) return 0.0;
    const w = this.getWidth();
    const h = this.getHeight();
    if (w > h) return w;
    return h;
  }
  contains() {
    if (arguments.length === 1) {
      if (arguments[0] instanceof Envelope) {
        const other = arguments[0];
        return this.covers(other);
      } else if (coordinates.isCoordinate(arguments[0])) {
        const p = arguments[0];
        return this.covers(p);
      }
    } else if (arguments.length === 2) {
      const x = arguments[0];
      const y = arguments[1];
      return this.covers(x, y);
    }
  }
  centre() {
    if (this.isNull()) return null;
    return [
      (this.getMinX() + this.getMaxX()) / 2.0,
      (this.getMinY() + this.getMaxY()) / 2.0,
    ];
  }
  init() {
    this._setToNull();
    if (arguments.length === 1) {
      if (coordinates.isCoordinate(arguments[0])) {
        let p = arguments[0];
        this.init(x(p), x(p), y(p), y(p));
      } else if (arguments[0] instanceof Envelope) {
        let env = arguments[0];
        this._minx = env._minx;
        this._maxx = env._maxx;
        this._miny = env._miny;
        this._maxy = env._maxy;
      }
    } else if (arguments.length === 2) {
      let p1 = arguments[0];
      let p2 = arguments[1];
      this.init(x(p1), x(p2), y(p1), y(p2));
    } else if (arguments.length === 4) {
      const x1 = arguments[0];
      const x2 = arguments[1];
      const y1 = arguments[2];
      const y2 = arguments[3];
      if (x1 < x2) {
        this._minx = x1;
        this._maxx = x2;
      } else {
        this._minx = x2;
        this._maxx = x1;
      }
      if (y1 < y2) {
        this._miny = y1;
        this._maxy = y2;
      } else {
        this._miny = y2;
        this._maxy = y1;
      }
    }
  }
  getMaxY() {
    return this._maxy;
  }
  distance(env) {
    if (this.intersects(env)) return 0;
    var dx = 0.0;
    if (this._maxx < env._minx) dx = env._minx - this._maxx;
    else if (this._minx > env._maxx) dx = this._minx - env._maxx;
    var dy = 0.0;
    if (this._maxy < env._miny) dy = env._miny - this._maxy;
    else if (this._miny > env._maxy) dy = this._miny - env._maxy;
    if (dx === 0.0) return dy;
    if (dy === 0.0) return dx;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /**
   *
   * @param {GeoJSONCoordinate} p1
   * @param {GeoJSONCoordinate} p2
   * @param {GeoJSONCoordinate} q1
   * @param {GeoJSONCoordinate} q2
   */
  static intersects(p1, p2, q1, q2) {
    if (arguments.length === 3) {
      if (
        x(q1) >= (x(p1) < x(p2) ? x(p1) : x(p2)) &&
        x(q1) <= (x(p1) > x(p2) ? x(p1) : x(p2)) &&
        y(q1) >= (y(p1) < y(p2) ? y(p1) : y(p2)) &&
        y(q1) <= (y(p1) > y(p2) ? y(p1) : y(p2))
      ) {
        return true;
      }
      return false;
    } else if (arguments.length === 4) {
      let minq = Math.min(x(q1), x(q2));
      let maxq = Math.max(x(q1), x(q2));
      let minp = Math.min(x(p1), x(p2));
      let maxp = Math.max(x(p1), x(p2));
      if (minp > maxq) return false;
      if (maxp < minq) return false;
      minq = Math.min(y(q1), y(q2));
      maxq = Math.max(y(q1), y(q2));
      minp = Math.min(y(p1), y(p2));
      maxp = Math.max(y(p1), y(p2));
      if (minp > maxq) return false;
      if (maxp < minq) return false;
      return true;
    }
  }
}
