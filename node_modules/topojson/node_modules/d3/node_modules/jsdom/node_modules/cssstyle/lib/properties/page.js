'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('page', v);
    },
    get: function () {
        return this.getPropertyValue('page');
    },
    enumerable: true
};
