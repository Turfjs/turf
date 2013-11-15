'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font-weight', v);
    },
    get: function () {
        return this.getPropertyValue('font-weight');
    },
    enumerable: true
};
