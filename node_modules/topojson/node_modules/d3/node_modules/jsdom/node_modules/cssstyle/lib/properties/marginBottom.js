'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('margin-bottom', v);
    },
    get: function () {
        return this.getPropertyValue('margin-bottom');
    },
    enumerable: true
};
