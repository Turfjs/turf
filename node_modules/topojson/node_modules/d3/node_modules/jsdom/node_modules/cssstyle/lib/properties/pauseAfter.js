'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('pause-after', v);
    },
    get: function () {
        return this.getPropertyValue('pause-after');
    },
    enumerable: true
};
