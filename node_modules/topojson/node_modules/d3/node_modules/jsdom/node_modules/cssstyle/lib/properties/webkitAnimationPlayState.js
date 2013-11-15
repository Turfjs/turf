'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-animation-play-state', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation-play-state');
    },
    enumerable: true
};
