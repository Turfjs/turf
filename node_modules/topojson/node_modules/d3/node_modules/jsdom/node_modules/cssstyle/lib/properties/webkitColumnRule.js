'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-rule', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-rule');
    },
    enumerable: true
};
