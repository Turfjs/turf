'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('color-profile', v);
    },
    get: function () {
        return this.getPropertyValue('color-profile');
    },
    enumerable: true
};
