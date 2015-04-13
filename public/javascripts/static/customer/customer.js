/**
 * Created by Carlis on 4/10/15.
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
        utils = require('utils');

    function Customer(container) {
        var customerId;
        this.container = container = typeof container === 'string' ? $(container) : container;
        if ((customerId = container.find('#customer-id')).length) {
            this.id = customerId.val();
        }
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
        },
        clear: function () {
            if (this.container) {
                this.container.find('input[type="text"]').val('');
                this.clearStyle();
            }
            return this;
        },
        clearStyle: function () {
            this.container && this.container.find('.control-group').removeClass('error success');
            return this;
        },
        getCustomerById: function (id, callback) {
            if (!id) {
                callback(null);
            } else {
                $.getJSON('/customer/details/' + id).done(function (data) {
                    callback(data.customer);
                }).fail(function (err) {
                        callback(null);
                    });
            }
            return this;
        }
    };

    Customer.Display = function (container) {
        this.container = typeof container === 'string' ? $(container) : container;
        this.template = $.trim($('#customer-row-template').html());
    };
    Customer.Display.fn = Customer.Display.prototype = {
        add: function (data) {
            this.render(data);
            return this;
        },
        remove: function (id, callback) {
            var that = this;
            callback = $.isFunction(callback) ? callback : function () {
            };
            if (id) {
                $.post('/customer/remove.html', {id: id}).done(function (data) {
                    that.container.find('tbody tr[data-customer-id="' + id + '"]').remove();
                    callback(null, data);
                }).fail(callback);
            } else {
                callback(new Error("Customer's ID is empty, can not delete."));
            }
            return this;
        },
        render: function (data) {
            data['fix-address'] = function (address, separator) {
                var result;
                separator = separator || ', '
                result = address.street + separator + address.city;
                if (address.country) {
                    result += separator + address.country;
                }
                return result;
            }(data.address);
            var html = utils.template(this.template, data);
            this.container.find('tbody').prepend(html);
            return this;
        },
        collectData: function (row, id) {
            var data = {}, trim = $.trim, tds;
            if (id) {
                data.id = trim(row.attr(id));
            } else {
                tds = row.find('td');
                $.each(['name', 'tel', 'address'], function (index, content) {
                    var result = $(tds[inex]).attr('data-customer-' + content);
                    if (result) {
                        data[content] = JSON.parse(result);
                    }
                });
            }
            return data;
        }
    };

    module.exports = Customer;
});
