'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-after-collapse', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-after-collapse');
    },
    enumerable: true
};
