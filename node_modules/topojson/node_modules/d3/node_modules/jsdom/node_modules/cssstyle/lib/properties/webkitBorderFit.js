'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-fit', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-fit');
    },
    enumerable: true
};
