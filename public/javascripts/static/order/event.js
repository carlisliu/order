/**
 * Created by Carlis on 4/13/15.
 */
define(function (require) {
    var $ = require('jquery'),
        Order = require('./order'),
        Customer = require('../customer/customer'),
        customer = new Customer('#customer-container'),
        Product = require('../product/product'),
        product = new Product(),
        utils = require('utils');

    require('jgrowl');

    $(function () {
        var categoryEl, productEl;
        $('#customer-id').change(function () {
            var id = $(this).val();
            if (!id) {
                customer.clear();
                return this;
            }
            customer.getCustomerById($(this).val(), function (customerItem) {
                var container = customer.container;
                if (customerItem) {
                    container.find('#customer-tel').val(customerItem.tel);
                    container.find('#customer-addr-street').val(customerItem.address.street);
                    container.find('#customer-addr-city').val(customerItem.address.city);
                    container.find('#customer-addr-country').val(customerItem.address.country);
                }
            });
        });

        categoryEl = $('#category-id');
        productEl = $('#product-id');

        categoryEl.change(function () {
            var categoryId = categoryEl.val();
            if (categoryId) {
                product.getProductByCategoryId(categoryId, function (err, data) {
                    var msg = err || data.msg || '', products;
                    msg && $.jGrowl(msg);
                    if ((products = data.products)) {
                        productEl.data('productsData', products);
                        utils.bindSelector(productEl, utils.convert(products, 'id', 'name'));
                        productEl.trigger('change');
                    }
                });
            }
        });

        productEl.change(function () {
            var productId = productEl.val(), products, priceEl = $('#product-price');
            priceEl.val('');
            if (productId) {
                products = productEl.data('productsData');
                $.each(products, function (index, content) {
                    if (productId === content.id) {
                        $('#product-price').val(content.price);
                        return false;
                    }
                });
            }
        });
    });
});