'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-decoration', v);
    },
    get: function () {
        return this.getPropertyValue('text-decoration');
    },
    enumerable: true
};
