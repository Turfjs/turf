'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('pitch-range', v);
    },
    get: function () {
        return this.getPropertyValue('pitch-range');
    },
    enumerable: true
};
