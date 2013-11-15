'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transform-origin-z', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transform-origin-z');
    },
    enumerable: true
};
