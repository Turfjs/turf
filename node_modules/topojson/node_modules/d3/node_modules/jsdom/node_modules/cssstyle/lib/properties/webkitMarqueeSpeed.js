'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-marquee-speed', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-marquee-speed');
    },
    enumerable: true
};
