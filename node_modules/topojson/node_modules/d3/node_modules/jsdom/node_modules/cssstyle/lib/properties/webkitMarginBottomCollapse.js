'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('-webkit-margin-bottom-collapse', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-margin-bottom-collapse');
    },
    enumerable: true
};
