'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('stop-opacity', v);
    },
    get: function () {
        return this.getPropertyValue('stop-opacity');
    },
    enumerable: true
};
