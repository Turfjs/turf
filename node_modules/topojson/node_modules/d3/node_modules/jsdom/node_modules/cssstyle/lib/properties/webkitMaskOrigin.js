'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-origin', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-origin');
    },
    enumerable: true
};
