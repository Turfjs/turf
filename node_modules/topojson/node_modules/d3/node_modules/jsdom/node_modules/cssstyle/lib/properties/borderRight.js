'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-right', v);
    },
    get: function () {
        return this.getPropertyValue('border-right');
    },
    enumerable: true
};
