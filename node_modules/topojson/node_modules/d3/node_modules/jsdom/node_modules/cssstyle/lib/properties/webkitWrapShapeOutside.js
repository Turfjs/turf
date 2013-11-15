'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-wrap-shape-outside', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-wrap-shape-outside');
    },
    enumerable: true
};
