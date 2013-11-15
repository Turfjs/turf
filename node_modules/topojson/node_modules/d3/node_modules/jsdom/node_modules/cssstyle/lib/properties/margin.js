'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('margin', v);
    },
    get: function () {
        return this.getPropertyValue('margin');
    },
    enumerable: true
};
