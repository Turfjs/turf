'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flex-align', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flex-align');
    },
    enumerable: true
};
