'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('color', v);
    },
    get: function () {
        return this.getPropertyValue('color');
    },
    enumerable: true
};
