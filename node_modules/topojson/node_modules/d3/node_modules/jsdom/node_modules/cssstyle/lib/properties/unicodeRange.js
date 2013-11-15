'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('unicode-range', v);
    },
    get: function () {
        return this.getPropertyValue('unicode-range');
    },
    enumerable: true
};
