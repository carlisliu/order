/**
 * Created by Carlis on 4/10/15.
 */
define(function (require, exports, module) {
    var $ = require('validate');

    function Customer(container) {
        container = typeof container === 'string' ? $(container) : container;
        this.name = container.find('#customer-name').val();
        this.tel = container.find('#customer-tel').val();
        this.address = {
            street: container.find('#customer-addr-street').val(),
            city: container.find('#customer-addr-city').val(),
            country: container.find('#customer-addr-country').val()
        };
    }

    Customer.fn = Customer.prototype = {
        save: function (callback) {
            var customer = {};
            customer.name = this.name;
            customer.tel = this.tel;
            customer.address = this.address;
            $.post('/customer/add.html', {customer: customer}).done(function (data) {
                $.isFunction(callback) && callback(null, data);
            }).fail(function (e) {
                    $.isFunction(callback) && callback(e);
                });
            return this;
        }
    };
    module.exports = Customer;
});
