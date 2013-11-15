'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-marquee-increment', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-marquee-increment');
    },
    enumerable: true
};
