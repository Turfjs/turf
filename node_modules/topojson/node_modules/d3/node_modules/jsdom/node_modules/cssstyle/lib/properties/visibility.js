'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('visibility', v);
    },
    get: function () {
        return this.getPropertyValue('visibility');
    },
    enumerable: true
};
