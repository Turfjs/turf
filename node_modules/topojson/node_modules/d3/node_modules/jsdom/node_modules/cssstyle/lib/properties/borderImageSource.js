'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('border-image-source', v);
    },
    get: function () {
        return this.getPropertyValue('border-image-source');
    },
    enumerable: true
};
