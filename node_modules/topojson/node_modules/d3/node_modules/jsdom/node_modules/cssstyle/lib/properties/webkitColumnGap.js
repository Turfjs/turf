'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-column-gap', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-column-gap');
    },
    enumerable: true
};
