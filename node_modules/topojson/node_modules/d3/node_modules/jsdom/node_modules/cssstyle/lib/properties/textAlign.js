'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-align', v);
    },
    get: function () {
        return this.getPropertyValue('text-align');
    },
    enumerable: true
};
