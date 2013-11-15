'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-writing-mode', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-writing-mode');
    },
    enumerable: true
};
