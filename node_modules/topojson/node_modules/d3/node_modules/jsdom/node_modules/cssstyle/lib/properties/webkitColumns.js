'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-columns', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-columns');
    },
    enumerable: true
};
