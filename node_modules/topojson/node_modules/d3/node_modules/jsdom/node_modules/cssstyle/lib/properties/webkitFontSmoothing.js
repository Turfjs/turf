'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-font-smoothing', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-font-smoothing');
    },
    enumerable: true
};
