'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('fill-opacity', v);
    },
    get: function () {
        return this.getPropertyValue('fill-opacity');
    },
    enumerable: true
};
