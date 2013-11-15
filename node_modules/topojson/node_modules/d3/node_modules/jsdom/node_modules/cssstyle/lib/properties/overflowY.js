'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('overflow-y', v);
    },
    get: function () {
        return this.getPropertyValue('overflow-y');
    },
    enumerable: true
};
