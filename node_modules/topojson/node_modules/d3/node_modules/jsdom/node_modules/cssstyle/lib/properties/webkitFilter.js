'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-filter', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-filter');
    },
    enumerable: true
};
