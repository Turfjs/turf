'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('margin-top', v);
    },
    get: function () {
        return this.getPropertyValue('margin-top');
    },
    enumerable: true
};
