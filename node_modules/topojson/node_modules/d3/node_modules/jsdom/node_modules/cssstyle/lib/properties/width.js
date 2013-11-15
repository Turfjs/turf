'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('width', v);
    },
    get: function () {
        return this.getPropertyValue('width');
    },
    enumerable: true
};
