'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-shadow', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-shadow');
    },
    enumerable: true
};
