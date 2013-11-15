'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('mask', v);
    },
    get: function () {
        return this.getPropertyValue('mask');
    },
    enumerable: true
};
