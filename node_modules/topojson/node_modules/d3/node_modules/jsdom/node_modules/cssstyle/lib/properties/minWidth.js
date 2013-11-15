'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('min-width', v);
    },
    get: function () {
        return this.getPropertyValue('min-width');
    },
    enumerable: true
};
