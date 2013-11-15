'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('zoom', v);
    },
    get: function () {
        return this.getPropertyValue('zoom');
    },
    enumerable: true
};
