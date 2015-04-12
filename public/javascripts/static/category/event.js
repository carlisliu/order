/**
 * Created by Carlis on 4/12/15.
 */

define(function (require, exports, module) {
    var $ = require('jquery'), msg = window.msg;
    require('validate');
    require('jgrowl');

    if (msg && 'null' !== msg) {
        $.jGrowl(msg);
        msg = null;
    }

    $.validator.setDefaults({
        onsubmit: false
    });

    $(function () {
        var Category = require('./category');
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
                var category = new Category('#category-form');
                category.save(function (err, data) {
                    var msg = err ? err.toString() : data.msg;
                    $.jGrowl(msg);
                });
            }
        });

    });
});
