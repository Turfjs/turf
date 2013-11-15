'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('pitch', v);
    },
    get: function () {
        return this.getPropertyValue('pitch');
    },
    enumerable: true
};
