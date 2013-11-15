'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('background', v);
    },
    get: function () {
        return this.getPropertyValue('background');
    },
    enumerable: true
};
