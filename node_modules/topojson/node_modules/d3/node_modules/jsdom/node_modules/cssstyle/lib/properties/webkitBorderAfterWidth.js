'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-after-width', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-after-width');
    },
    enumerable: true
};
