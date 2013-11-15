'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-overline', v);
    },
    get: function () {
        return this.getPropertyValue('text-overline');
    },
    enumerable: true
};
