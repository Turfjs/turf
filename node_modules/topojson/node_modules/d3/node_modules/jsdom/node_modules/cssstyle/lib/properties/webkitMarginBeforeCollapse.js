'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-before-collapse', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-before-collapse');
    },
    enumerable: true
};
