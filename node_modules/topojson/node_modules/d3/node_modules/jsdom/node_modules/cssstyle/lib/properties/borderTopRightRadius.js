'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-top-right-radius', v);
    },
    get: function () {
        return this.getPropertyValue('border-top-right-radius');
    },
    enumerable: true
};
