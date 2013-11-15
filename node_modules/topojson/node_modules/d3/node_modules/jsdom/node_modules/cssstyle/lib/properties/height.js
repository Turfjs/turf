'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('height', v);
    },
    get: function () {
        return this.getPropertyValue('height');
    },
    enumerable: true
};
