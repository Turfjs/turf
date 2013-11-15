'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('page-break-inside', v);
    },
    get: function () {
        return this.getPropertyValue('page-break-inside');
    },
    enumerable: true
};
