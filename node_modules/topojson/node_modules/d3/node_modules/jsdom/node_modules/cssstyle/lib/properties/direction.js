'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('direction', v);
    },
    get: function () {
        return this.getPropertyValue('direction');
    },
    enumerable: true
};
