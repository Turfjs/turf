'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('position', v);
    },
    get: function () {
        return this.getPropertyValue('position');
    },
    enumerable: true
};
