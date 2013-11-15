'use strict';

module.exports = {
    set: function (v) {
        this.setProperty('voic-family', v);
    },
    get: function () {
        return this.getPropertyValue('voice-family');
    },
    enumerable: true
};
