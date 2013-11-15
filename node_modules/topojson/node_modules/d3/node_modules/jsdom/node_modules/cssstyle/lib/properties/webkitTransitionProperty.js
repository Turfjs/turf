'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-transition-property', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-transition-property');
    },
    enumerable: true
};
