'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('src', v);
    },
    get: function () {
        return this.getPropertyValue('src');
    },
    enumerable: true
};
