'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-color', v);
    },
    get: function () {
        return this.getPropertyValue('background-color');
    },
    enumerable: true
};
