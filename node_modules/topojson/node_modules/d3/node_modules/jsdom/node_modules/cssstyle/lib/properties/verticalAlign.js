'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('vertical-align', v);
    },
    get: function () {
        return this.getPropertyValue('vertical-align');
    },
    enumerable: true
};
