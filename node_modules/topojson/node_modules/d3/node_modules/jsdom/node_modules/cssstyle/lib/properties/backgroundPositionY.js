'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background-position-y', v);
    },
    get: function () {
        return this.getPropertyValue('background-position-y');
    },
    enumerable: true
};
