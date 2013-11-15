'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('text-indent', v);
    },
    get: function () {
        return this.getPropertyValue('text-indent');
    },
    enumerable: true
};
