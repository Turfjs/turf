'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-wrap', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-wrap');
    },
    enumerable: true
};
