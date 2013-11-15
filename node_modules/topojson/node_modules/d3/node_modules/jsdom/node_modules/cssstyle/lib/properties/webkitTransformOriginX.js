'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transform-origin-x', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transform-origin-x');
    },
    enumerable: true
};
