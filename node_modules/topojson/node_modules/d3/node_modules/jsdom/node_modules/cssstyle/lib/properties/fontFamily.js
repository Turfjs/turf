'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('font-family', v);
    },
    get: function () {
        return this.getPropertyValue('font-family');
    },
    enumerable: true
};
