'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('padding', v);
    },
    get: function () {
        return this.getPropertyValue('padding');
    },
    enumerable: true
};
