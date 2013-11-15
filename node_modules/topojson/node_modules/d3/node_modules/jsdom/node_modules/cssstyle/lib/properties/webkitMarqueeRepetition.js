'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-marquee-repetition', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-marquee-repetition');
    },
    enumerable: true
};
