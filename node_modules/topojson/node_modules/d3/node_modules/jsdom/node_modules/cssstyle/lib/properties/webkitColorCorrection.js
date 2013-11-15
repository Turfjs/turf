'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-color-correction', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-color-correction');
    },
    enumerable: true
};
