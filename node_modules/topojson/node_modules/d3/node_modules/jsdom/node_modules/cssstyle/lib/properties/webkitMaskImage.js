'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-image', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-image');
    },
    enumerable: true
};
