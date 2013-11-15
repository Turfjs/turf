'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-locale', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-locale');
    },
    enumerable: true
};
