'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('fill', v);
    },
    get: function () {
        return this.getPropertyValue('fill');
    },
    enumerable: true
};
