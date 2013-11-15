'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-animation-duration', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation-duration');
    },
    enumerable: true
};
