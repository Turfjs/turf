'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-min-logical-height', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-min-logical-height');
    },
    enumerable: true
};
