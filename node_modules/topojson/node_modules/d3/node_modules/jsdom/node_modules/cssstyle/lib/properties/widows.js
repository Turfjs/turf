'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('widows', v);
    },
    get: function () {
        return this.getPropertyValue('widows');
    },
    enumerable: true
};
