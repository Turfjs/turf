'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('margin-right', v);
    },
    get: function () {
        return this.getPropertyValue('margin-right');
    },
    enumerable: true
};
