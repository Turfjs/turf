'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('overflow-x', v);
    },
    get: function () {
        return this.getPropertyValue('overflow-x');
    },
    enumerable: true
};
