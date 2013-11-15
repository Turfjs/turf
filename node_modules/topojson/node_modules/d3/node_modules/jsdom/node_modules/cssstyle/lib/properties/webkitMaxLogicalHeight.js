'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-max-logical-height', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-max-logical-height');
    },
    enumerable: true
};
