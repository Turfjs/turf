'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font', v);
    },
    get: function () {
        return this.getPropertyValue('font');
    },
    enumerable: true
};
