'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('letter-spacing', v);
    },
    get: function () {
        return this.getPropertyValue('letter-spacing');
    },
    enumerable: true
};
