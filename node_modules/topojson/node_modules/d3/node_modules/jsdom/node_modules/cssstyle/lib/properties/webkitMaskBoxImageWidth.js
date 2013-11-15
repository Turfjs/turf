'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-box-image-width', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-box-image-width');
    },
    enumerable: true
};
