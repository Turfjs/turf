'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-wrap-through', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-wrap-through');
    },
    enumerable: true
};
