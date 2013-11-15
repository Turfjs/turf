'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke-linejoin', v);
    },
    get: function () {
        return this.getPropertyValue('stroke-linejoin');
    },
    enumerable: true
};
