/**
 * Created by Carlis on 4/10/15.
 */

define(function (require) {
    var $ = require('jquery'), Customer;
    require('validate');
    Customer = require('./customer');
    $.validator.setDefaults({
        onsubmit: false
    });
    $('#save-customer').click(function (e) {
        e.preventDefault();
        var form = $('.validate'), customer;
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
            customer = new Customer('#customer-form');
            customer.save(function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('saved');
                    console.log(data);
                }
            });
        }
    });


    $('button.btn-primary').click(function (e) {
        var form = $('.validate').validate({
            errorPlacement: function (error, element) {
                element.parents('.controls').append(error);
            },
            highlight: function (label) {
                $(label).closest('.control-group').removeClass('error success').addClass('error');
            },
            success: function (label) {
                label.addClass('valid').closest('.control-group').removeClass('error success').addClass('success');
            },
            onsubmit: false
        }), customer;
        if (form.valid()) {
            customer = new Customer('#customer-form');
            customer.save(function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('saved');
                    console.log(data);
                }
            });
        }
    });
});