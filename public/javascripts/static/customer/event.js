/**
 * Created by Carlis on 4/10/15.
 */

define(function (require) {
    var $ = require('jquery');

    $(function () {
        var Customer, Display, customerDisplay, Modal, utils, validateOpts = {
            errorPlacement: function (error, element) {
                element.parents('.controls').append(error);
            },
            highlight: function (label) {
                $(label).closest('.control-group').removeClass('error success').addClass('error');
            },
            success: function (label) {
                label.addClass('valid').closest('.control-group').removeClass('error success').addClass('success');
            }
        };
        require('validate');
        require('validate.extend');
        require('jgrowl');
        require('bootstrap.modal');
        utils = require('utils');
        Customer = require('./customer');
        Display = Customer.Display;
        Modal = require('../common/modal');

        $.validator.setDefaults({
            onsubmit: false
        });

        customerDisplay = new Display('#customers-holder');
        customerDisplay.container.delegate('tbody tr td a', 'click', function (e) {
            e.preventDefault();
            var modal = new Modal('#info-modal'), $this = $(this), el, trim = $.trim, parent, address;
            if ($this.hasClass('deleteRow')) {
                modal.setTitle('Warning').setBody('<p>Do you wanna remove this customer?</p>').bindFooter('danger', function () {
                    customerDisplay.remove($this.parents('tr').attr('data-customer-id'), function (err, data) {
                        $.jGrowl(err ? err.toString() : data.msg);
                    });
                });
            } else {
                el = trim($('#customer-form-template').html());
                parent = $this.parents('tr');
                address = trim(parent.find('td:nth-child(3)').attr('data-customer-address'));
                try {
                    address = JSON.parse(address);
                } catch (e) {
                    address = new Function('return ' + address);
                    address = address() || {};
                }
                var data = {
                    name: trim(parent.find('td:first-child').attr('data-customer-name')),
                    tel: trim(parent.find('td:nth-child(2)').attr('data-customer-tel')),
                    'address.street': address.street,
                    'address.city': address.city,
                    'address.country': address.country
                }
                modal.setTitle('Change Customer Info').setBody(utils.template(el, data)).bindFooter('confirm', function (modal) {
                    var form = modal.find('.validate');
                    form.validate(validateOpts);
                    if(form.valid()){
                        $.jGrowl('closed.');
                        return true;
                    }
                    return false;
                });
            }
        });

        $('#save-customer').click(function (e) {
            e.preventDefault();
            var form = $('.validate'), customer;
            form.validate(validateOpts);
            if (form.valid()) {
                customer = new Customer('#customer-form');
                customer.save(function (err, data) {
                    var msg = err ? 'Error occurs' : data.msg;
                    if (!err && data.msg === 'success') {
                        customer.clear();
                        customerDisplay.render(data.customer);
                    } else {
                        customer.clearStyle();
                    }
                    $.jGrowl(msg);
                });
            }
        });
    });


});