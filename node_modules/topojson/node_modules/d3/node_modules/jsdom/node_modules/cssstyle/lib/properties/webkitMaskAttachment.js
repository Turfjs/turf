'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-mask-attachment', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-mask-attachment');
    },
    enumerable: true
};
