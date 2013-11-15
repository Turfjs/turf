'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font-size', v);
    },
    get: function () {
        return this.getPropertyValue('font-size');
    },
    enumerable: true
};
