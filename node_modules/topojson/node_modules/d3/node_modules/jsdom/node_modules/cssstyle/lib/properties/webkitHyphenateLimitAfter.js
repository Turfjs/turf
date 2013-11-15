'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-hyphenate-limit-after', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-hyphenate-limit-after');
    },
    enumerable: true
};
