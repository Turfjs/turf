'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font-size-adjust', v);
    },
    get: function () {
        return this.getPropertyValue('font-size-adjust');
    },
    enumerable: true
};
