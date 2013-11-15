'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-font-size-delta', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-font-size-delta');
    },
    enumerable: true
};
