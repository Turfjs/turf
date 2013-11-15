'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-lines', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-lines');
    },
    enumerable: true
};
