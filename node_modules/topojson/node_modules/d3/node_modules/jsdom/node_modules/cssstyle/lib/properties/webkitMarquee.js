'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-marquee', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-marquee');
    },
    enumerable: true
};
