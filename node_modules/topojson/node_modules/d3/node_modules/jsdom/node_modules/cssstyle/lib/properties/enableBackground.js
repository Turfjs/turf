'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('enable-background', v);
    },
    get: function () {
        return this.getPropertyValue('enable-background');
    },
    enumerable: true
};
