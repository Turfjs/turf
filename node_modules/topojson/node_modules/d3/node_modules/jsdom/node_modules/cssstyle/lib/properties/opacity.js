'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('opacity', v);
    },
    get: function () {
        return this.getPropertyValue('opacity');
    },
    enumerable: true
};
