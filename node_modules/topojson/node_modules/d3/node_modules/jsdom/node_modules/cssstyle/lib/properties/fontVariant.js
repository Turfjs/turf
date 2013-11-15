'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font-variant', v);
    },
    get: function () {
        return this.getPropertyValue('font-variant');
    },
    enumerable: true
};
