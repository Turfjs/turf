'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-right-width', v);
    },
    get: function () {
        return this.getPropertyValue('border-right-width');
    },
    enumerable: true
};
