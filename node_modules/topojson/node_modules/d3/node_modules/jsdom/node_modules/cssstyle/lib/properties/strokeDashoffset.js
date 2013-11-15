'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke-dashoffset', v);
    },
    get: function () {
        return this.getPropertyValue('stroke-dashoffset');
    },
    enumerable: true
};
