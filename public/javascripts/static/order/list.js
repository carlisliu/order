/**
 * Created by Carlis on 4/18/15.
 */
define('static/order/list', ['jquery', '../utils/index', 'datepicker'], function (require) {
    var $ = require('jquery'),
        utils = require('../utils/index');

    require('datepicker');

    $(function () {
        var customerEl = $('#order-customer'), dateEl = $('#order-date'), orderNoEl = $('#order-no'), searchEl = $('#order-search');

        // bind customer select element.
        $.getJSON('/customer/get.html', function (data) {
            if (data && data.customer) {
                utils.bindSelector(customerEl, data.customer);
            }
        });

        dateEl.datepicker();

        var template = $.trim($('#order-result-template').html());
        var orderHolder = $('#order-detail-holder');

        searchEl.click(function (e) {
            e.preventDefault();
            var params = {}, trim = $.trim, val;
            val = trim(customerEl.val());
            if (val) {
                params.customer_id = val;
            }
            val = trim(dateEl.val());
            if (val) {
                params.create_at = val;
            }
            val = trim(orderNoEl.val());
            if (val) {
                params.no = val;
            }
            $.getJSON('/order/get.html', {params: params}, function (data) {
                orderHolder.find('tbody').empty();
                if (data && data.orders && data.orders.length) {
                    $.each(data.orders, function (index, content) {
                        var html = utils.template(template, content);
                        orderHolder.find('tbody').append(html);
                    });
                } else {
                    orderHolder.find('tbody').append('<tr><td colspan="5">No matching records found</td></tr>');
                }
            });
        });

        $('#order-detail-holder').find('tbody').delegate('tr a', 'click', function(e){
            e.preventDefault();
            window.open('/order/details/' + $(this).attr('data-order-no'));
        });

        searchEl.trigger('click');
    });
});
