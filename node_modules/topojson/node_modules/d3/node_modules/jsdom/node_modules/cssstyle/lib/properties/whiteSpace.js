'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('white-space', v);
    },
    get: function () {
        return this.getPropertyValue('white-space');
    },
    enumerable: true
};
