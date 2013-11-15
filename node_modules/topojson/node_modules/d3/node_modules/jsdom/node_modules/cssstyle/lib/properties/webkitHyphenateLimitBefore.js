'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-hyphenate-limit-before', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-hyphenate-limit-before');
    },
    enumerable: true
};
