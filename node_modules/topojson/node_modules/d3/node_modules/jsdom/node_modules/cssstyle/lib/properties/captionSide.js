'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('caption-side', v);
    },
    get: function () {
        return this.getPropertyValue('caption-side');
    },
    enumerable: true
};
