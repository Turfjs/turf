'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-size', v);
    },
    get: function () {
        return this.getPropertyValue('background-size');
    },
    enumerable: true
};
