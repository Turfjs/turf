'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-position-y', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-position-y');
    },
    enumerable: true
};
