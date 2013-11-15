'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-highlight', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-highlight');
    },
    enumerable: true
};
