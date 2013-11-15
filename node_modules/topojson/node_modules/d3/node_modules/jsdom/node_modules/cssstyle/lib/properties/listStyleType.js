'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('list-style-type', v);
    },
    get: function () {
        return this.getPropertyValue('list-style-type');
    },
    enumerable: true
};
