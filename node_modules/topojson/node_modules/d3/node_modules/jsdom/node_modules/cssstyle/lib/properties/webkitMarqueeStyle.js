'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-marquee-style', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-marquee-style');
    },
    enumerable: true
};
