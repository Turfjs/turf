'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-position-x', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-position-x');
    },
    enumerable: true
};
