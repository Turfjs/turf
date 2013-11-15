'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-overflow-scrolling', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-overflow-scrolling');
    },
    enumerable: true
};
