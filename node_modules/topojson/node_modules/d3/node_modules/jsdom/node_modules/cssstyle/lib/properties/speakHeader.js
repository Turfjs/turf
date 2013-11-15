'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('speak-header', v);
    },
    get: function () {
        return this.getPropertyValue('speak-header');
    },
    enumerable: true
};
