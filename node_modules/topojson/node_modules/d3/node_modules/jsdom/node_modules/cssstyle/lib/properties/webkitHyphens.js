'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-hyphens', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-hyphens');
    },
    enumerable: true
};
