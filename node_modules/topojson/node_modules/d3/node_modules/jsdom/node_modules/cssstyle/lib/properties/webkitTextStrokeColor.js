'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-stroke-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-stroke-color');
    },
    enumerable: true
};
