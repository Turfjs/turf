'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-flex', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-flex');
    },
    enumerable: true
};
