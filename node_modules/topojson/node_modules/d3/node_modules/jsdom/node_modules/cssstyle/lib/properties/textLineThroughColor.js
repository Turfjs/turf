'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-line-through-color', v);
    },
    get: function () {
        return this.getPropertyValue('text-line-through-color');
    },
    enumerable: true
};
