'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-text-security', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-text-security');
    },
    enumerable: true
};
