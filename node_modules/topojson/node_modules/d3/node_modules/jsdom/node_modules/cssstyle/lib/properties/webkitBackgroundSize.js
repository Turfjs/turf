'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-background-size', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-background-size');
    },
    enumerable: true
};
