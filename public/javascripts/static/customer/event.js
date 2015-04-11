/**
 * Created by Carlis on 4/10/15.
 */

define(function (require) {
    var $ = require('jquery');
    $(function () {
        var Customer, Display, customerDisplay;
        require('validate');
        require('jgrowl');
        Customer = require('./customer');
        Display = Customer.Display;
        $.validator.setDefaults({
            onsubmit: false
        });

        customerDisplay = new Display('#customers-holder');
        customerDisplay.container.delegate('table tbody tr a', 'click', function (e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.hasClass('deleteRow')) {
                customerDisplay.remove($this.parents('tr').attr('data-customer-id'), function(){
                    $.jGrowl('Removed');
                });
            } else {
                customerDisplay.render();
            }
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
                    var msg = err ? 'Error occurs' : data.msg;
                    if (!err) {
                        customer.clear();
                        console.log(data);
                    }
                    $.jGrowl(msg);
                });
            }
        });
    });


});