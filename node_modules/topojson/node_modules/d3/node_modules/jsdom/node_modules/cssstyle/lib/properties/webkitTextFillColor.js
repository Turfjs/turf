'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-fill-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-fill-color');
    },
    enumerable: true
};
