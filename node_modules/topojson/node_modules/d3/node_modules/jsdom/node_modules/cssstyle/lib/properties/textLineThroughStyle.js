'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-line-through-style', v);
    },
    get: function () {
        return this.getPropertyValue('text-line-through-style');
    },
    enumerable: true
};
