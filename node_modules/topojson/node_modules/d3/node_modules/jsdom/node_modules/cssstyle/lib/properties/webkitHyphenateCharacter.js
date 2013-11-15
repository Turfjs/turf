'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-hyphenate-character', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-hyphenate-character');
    },
    enumerable: true
};
