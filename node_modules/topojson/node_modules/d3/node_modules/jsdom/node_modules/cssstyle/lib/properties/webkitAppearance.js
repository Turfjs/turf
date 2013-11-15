'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-appearance', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-appearance');
    },
    enumerable: true
};
