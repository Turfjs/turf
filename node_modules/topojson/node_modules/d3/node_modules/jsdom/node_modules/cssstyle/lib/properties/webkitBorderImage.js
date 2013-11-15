'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-image', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-image');
    },
    enumerable: true
};
