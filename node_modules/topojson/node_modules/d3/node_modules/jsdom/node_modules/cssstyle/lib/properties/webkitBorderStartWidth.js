'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-border-start-width', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-border-start-width');
    },
    enumerable: true
};
