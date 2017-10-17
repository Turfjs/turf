/*
 * This file is here to attempt to prune down the huge size incurred by simply
 * importing the entirety of JSTS. We only need the BufferOp, so this copies the
 * essence of jsts/src/org/locationtech/jts/monkey.js, but reduces it to only
 * provide the `buffer` method.
 */

import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp';
import Geometry from 'jsts/org/locationtech/jts/geom/Geometry';
import extend from 'jsts/extend';

extend(Geometry.prototype, {
    buffer(distance) {
        return BufferOp.bufferOp(this, distance);
    },
});
