'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-marquee-direction', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-marquee-direction');
    },
    enumerable: true
};
