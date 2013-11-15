'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font-stretch', v);
    },
    get: function () {
        return this.getPropertyValue('font-stretch');
    },
    enumerable: true
};
