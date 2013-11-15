'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-top-collapse', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-top-collapse');
    },
    enumerable: true
};
