'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flex-item-align', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flex-item-align');
    },
    enumerable: true
};
