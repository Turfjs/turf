'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('list-style-position', v);
    },
    get: function () {
        return this.getPropertyValue('list-style-position');
    },
    enumerable: true
};
