'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-underline-style', v);
    },
    get: function () {
        return this.getPropertyValue('text-underline-style');
    },
    enumerable: true
};
