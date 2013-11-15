'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('overflow', v);
    },
    get: function () {
        return this.getPropertyValue('overflow');
    },
    enumerable: true
};
