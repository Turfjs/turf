'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-clip', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-clip');
    },
    enumerable: true
};
