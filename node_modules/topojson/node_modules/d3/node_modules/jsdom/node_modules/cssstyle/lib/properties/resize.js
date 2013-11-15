'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('resize', v);
    },
    get: function () {
        return this.getPropertyValue('resize');
    },
    enumerable: true
};
