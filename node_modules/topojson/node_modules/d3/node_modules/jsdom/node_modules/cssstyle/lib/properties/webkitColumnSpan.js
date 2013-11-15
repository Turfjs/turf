'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-span', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-span');
    },
    enumerable: true
};
