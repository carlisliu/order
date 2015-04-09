/**
 * Created by Carlis on 4/8/15.
 */

var moment = require('moment');

var utils = {
    extend: function (first, second) {
        var key
        if (first && second) {
            for (key in second) {
                if (second.hasOwnProperty(key)) {
                    first[key] = second[key];
                }
            }
        }
    },
    copyProperties: function (first, second, properties) {
        var i, length;
        if (first && second) {
            if (!properties) {
                this.extend(first, second);
            } else {
                if (!Array.isArray(properties)) {
                    properties = [].slice.call(arguments, 2);
                }
                for (i = 0, length = properties.length; i < length; i++) {
                    if (second.hasOwnProperty(properties[i])) {
                        first[properties[i]] = second[properties[i]];
                    }
                }
            }
        }
    },
    getOrderNo: function () {
        moment().format('YYYYMMDDHHmmss').replace(/\s+/g, '') + String(Math.random() * 16 | 0).substring(0, 1);
    },
    genId: function (prefix) {
        return (prefix || '' ) + moment().format('YYYYMMDDHHmmss').replace(/\s+/g, '');
    }
};

exports.utils = utils;
