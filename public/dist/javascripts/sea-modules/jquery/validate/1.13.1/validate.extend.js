/**
 * Created by Carlis on 4/15/15.
 */
define(function(require, exports, module){
    var $ = require('jquery');
    require('validate');
    $.validator.addMethod("gtZero", function (value, element) {
        value = parseFloat(value);
        return this.optional(element) || value > 0;
    }, "The input value must be greater than 0");

    $.validator.addMethod("tel", function (value, element) {
        return this.optional(element) || /^\d+$/.test(value) || /^(\d+)-(\d+)$/.test(value);
    }, "The tel format is wrong.");

    $.validator.addMethod("price", function (value, element) {
        return this.optional(element) || /^\d+$/.test(value) || /^(\d+)(\.?[0-9]{1,2})$/.test(value);
    }, "The price format is wrong. use a number, accurate to the second decimal place.");

});
