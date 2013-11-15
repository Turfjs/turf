'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-position-x', v);
    },
    get: function () {
        return this.getPropertyValue('background-position-x');
    },
    enumerable: true
};
