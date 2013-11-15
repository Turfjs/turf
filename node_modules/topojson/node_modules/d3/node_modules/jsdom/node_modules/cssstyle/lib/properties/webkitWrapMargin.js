'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-wrap-margin', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-wrap-margin');
    },
    enumerable: true
};
