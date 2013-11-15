'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('filter', v);
    },
    get: function () {
        return this.getPropertyValue('filter');
    },
    enumerable: true
};
