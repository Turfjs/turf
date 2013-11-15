'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-box-align', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-box-align');
    },
    enumerable: true
};
