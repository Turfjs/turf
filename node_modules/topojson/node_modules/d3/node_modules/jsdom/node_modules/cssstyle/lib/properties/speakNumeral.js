'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('speak-numeral', v);
    },
    get: function () {
        return this.getPropertyValue('speak-numeral');
    },
    enumerable: true
};
