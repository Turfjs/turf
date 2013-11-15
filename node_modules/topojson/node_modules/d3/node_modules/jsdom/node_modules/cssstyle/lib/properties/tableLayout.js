'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('table-layout', v);
    },
    get: function () {
        return this.getPropertyValue('table-layout');
    },
    enumerable: true
};
