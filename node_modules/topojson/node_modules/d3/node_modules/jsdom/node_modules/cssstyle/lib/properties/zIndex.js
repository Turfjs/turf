'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('z-index', v);
    },
    get: function () {
        return this.getPropertyValue('z-index');
    },
    enumerable: true
};
