'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('padding-top', v);
    },
    get: function () {
        return this.getPropertyValue('padding-top');
    },
    enumerable: true
};
