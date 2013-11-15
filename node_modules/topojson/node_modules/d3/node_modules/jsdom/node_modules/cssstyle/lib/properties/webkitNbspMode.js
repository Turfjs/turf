'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-nbsp-mode', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-nbsp-mode');
    },
    enumerable: true
};
