'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('top', v);
    },
    get: function () {
        return this.getPropertyValue('top');
    },
    enumerable: true
};
