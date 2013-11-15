'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-animation', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation');
    },
    enumerable: true
};
