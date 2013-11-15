'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stroke-dasharray', v);
    },
    get: function () {
        return this.getPropertyValue('stroke-dasharray');
    },
    enumerable: true
};
