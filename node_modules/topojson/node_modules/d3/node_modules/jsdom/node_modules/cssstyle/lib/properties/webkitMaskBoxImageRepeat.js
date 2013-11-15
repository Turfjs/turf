'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-box-image-repeat', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-box-image-repeat');
    },
    enumerable: true
};
