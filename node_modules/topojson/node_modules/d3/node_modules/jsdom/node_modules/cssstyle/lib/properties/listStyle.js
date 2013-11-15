'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('list-style', v);
    },
    get: function () {
        return this.getPropertyValue('list-style');
    },
    enumerable: true
};
