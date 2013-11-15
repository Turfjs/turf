'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('page-break-before', v);
    },
    get: function () {
        return this.getPropertyValue('page-break-before');
    },
    enumerable: true
};
