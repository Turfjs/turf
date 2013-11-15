'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('lighting-color', v);
    },
    get: function () {
        return this.getPropertyValue('lighting-color');
    },
    enumerable: true
};
