'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-end-width', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-end-width');
    },
    enumerable: true
};
