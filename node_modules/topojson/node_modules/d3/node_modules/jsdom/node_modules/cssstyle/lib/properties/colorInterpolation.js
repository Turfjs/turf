'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('color-interpolation', v);
    },
    get: function () {
        return this.getPropertyValue('color-interpolation');
    },
    enumerable: true
};
