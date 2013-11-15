'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-reflect', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-reflect');
    },
    enumerable: true
};
