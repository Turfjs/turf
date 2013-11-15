'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-line-clamp', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-line-clamp');
    },
    enumerable: true
};
