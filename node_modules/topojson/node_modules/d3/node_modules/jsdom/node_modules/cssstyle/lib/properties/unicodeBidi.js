'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('unicode-bidi', v);
    },
    get: function () {
        return this.getPropertyValue('unicode-bidi');
    },
    enumerable: true
};
