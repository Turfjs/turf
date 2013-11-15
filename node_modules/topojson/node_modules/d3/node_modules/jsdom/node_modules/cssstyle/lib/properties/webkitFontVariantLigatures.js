'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-font-variant-ligatures', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-font-variant-ligatures');
    },
    enumerable: true
};
