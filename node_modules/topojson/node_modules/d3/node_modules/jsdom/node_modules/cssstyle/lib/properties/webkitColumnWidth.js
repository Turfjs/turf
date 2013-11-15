'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-width', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-width');
    },
    enumerable: true
};
