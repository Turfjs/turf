'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-animation-direction', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation-direction');
    },
    enumerable: true
};
