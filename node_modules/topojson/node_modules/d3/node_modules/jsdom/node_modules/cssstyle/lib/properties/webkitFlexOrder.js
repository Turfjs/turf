'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flex-order', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flex-order');
    },
    enumerable: true
};
