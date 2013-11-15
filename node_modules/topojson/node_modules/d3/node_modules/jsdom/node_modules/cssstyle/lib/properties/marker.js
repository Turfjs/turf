'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('marker', v);
    },
    get: function () {
        return this.getPropertyValue('marker');
    },
    enumerable: true
};
