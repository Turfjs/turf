'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-box-image', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-box-image');
    },
    enumerable: true
};
