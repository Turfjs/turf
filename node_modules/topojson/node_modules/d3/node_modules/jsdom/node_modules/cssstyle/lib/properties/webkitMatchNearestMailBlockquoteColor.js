'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-match-nearest-mail-blockquote-color', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-match-nearest-mail-blockquote-color');
    },
    enumerable: true
};
