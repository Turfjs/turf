'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke-opacity', v);
    },
    get: function () {
        return this.getPropertyValue('stroke-opacity');
    },
    enumerable: true
};
