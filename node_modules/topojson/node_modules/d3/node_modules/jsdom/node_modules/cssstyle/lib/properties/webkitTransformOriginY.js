'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transform-origin-y', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transform-origin-y');
    },
    enumerable: true
};
