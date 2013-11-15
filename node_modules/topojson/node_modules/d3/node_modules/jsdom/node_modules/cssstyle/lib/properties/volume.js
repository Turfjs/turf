'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('volume', v);
    },
    get: function () {
        return this.getPropertyValue('volume');
    },
    enumerable: true
};
