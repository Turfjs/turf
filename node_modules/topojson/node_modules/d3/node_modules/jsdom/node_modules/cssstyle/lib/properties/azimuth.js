'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('azimuth', v);
    },
    get: function () {
        return this.getPropertyValue('azimuth');
    },
    enumerable: true
};
