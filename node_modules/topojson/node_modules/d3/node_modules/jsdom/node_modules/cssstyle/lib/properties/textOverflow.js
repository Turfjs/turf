'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-overflow', v);
    },
    get: function () {
        return this.getPropertyValue('text-overflow');
    },
    enumerable: true
};
