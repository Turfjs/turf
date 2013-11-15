'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke-width', v);
    },
    get: function () {
        return this.getPropertyValue('stroke-width');
    },
    enumerable: true
};
