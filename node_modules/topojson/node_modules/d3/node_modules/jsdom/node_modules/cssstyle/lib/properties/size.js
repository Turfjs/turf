'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('size', v);
    },
    get: function () {
        return this.getPropertyValue('size');
    },
    enumerable: true
};
