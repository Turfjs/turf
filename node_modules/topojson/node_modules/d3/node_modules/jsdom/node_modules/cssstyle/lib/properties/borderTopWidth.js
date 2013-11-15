'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-top-width', v);
    },
    get: function () {
        return this.getPropertyValue('border-top-width');
    },
    enumerable: true
};
