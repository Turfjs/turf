'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('kerning', v);
    },
    get: function () {
        return this.getPropertyValue('kerning');
    },
    enumerable: true
};
