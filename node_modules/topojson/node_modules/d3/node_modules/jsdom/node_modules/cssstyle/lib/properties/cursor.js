'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('cursor', v);
    },
    get: function () {
        return this.getPropertyValue('cursor');
    },
    enumerable: true
};
