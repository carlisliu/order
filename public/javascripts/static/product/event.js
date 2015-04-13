/**
 * Created by Carlis on 4/12/15.
 */
define(function (require) {
    var $ = require('jquery'), msg = window.msg, Product = require('./product');
    require('validate');
    require('jgrowl');

    if (msg && 'null' !== msg) {
        $.jGrowl(msg);
        msg = null;
    }

    $.validator.setDefaults({
        onsubmit: false
    });

    $('#save-category').click(function (e) {
        e.preventDefault();
        var form = $('.validate');
        form.validate({
            errorPlacement: function (error, element) {
                element.parents('.controls').append(error);
            },
            highlight: function (label) {
                $(label).closest('.control-group').removeClass('error success').addClass('error');
            },
            success: function (label) {
                label.addClass('valid').closest('.control-group').removeClass('error success').addClass('success');
            }
        });
        if (form.valid()) {
            var product = new Product('#product-form');
            product.save(function (err, data) {
                if (data) {
                    $.jGrowl(data.msg || 'Saved.');
                } else {
                    $.jGrowl('Error occurs.' + e ? e.toString() : '');
                }
            });
        }
    });

});