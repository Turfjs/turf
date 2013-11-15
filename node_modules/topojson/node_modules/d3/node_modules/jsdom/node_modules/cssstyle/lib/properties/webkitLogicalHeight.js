'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-logical-height', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-logical-height');
    },
    enumerable: true
};
