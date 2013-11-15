'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-radius', v);
    },
    get: function () {
        return this.getPropertyValue('border-radius');
    },
    enumerable: true
};
