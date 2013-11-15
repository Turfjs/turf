'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('orphans', v);
    },
    get: function () {
        return this.getPropertyValue('orphans');
    },
    enumerable: true
};
