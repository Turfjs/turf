'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-flex-direction', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-flex-direction');
    },
    enumerable: true
};
