'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('color-interpolation-filters', v);
    },
    get: function () {
        return this.getPropertyValue('color-interpolation-filters');
    },
    enumerable: true
};
