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
        var categoryEl, productEl, productQtyActionEl, productPriceEl, productQtyEl;
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
        productQtyActionEl = $('#product-qty-actions');
        productPriceEl = $('#product-price');
        productQtyEl = $('#product-qty');

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
            var productId = productEl.val(), products;
            productPriceEl.val('');
            if (productId) {
                products = productEl.data('productsData');
                $.each(products, function (index, content) {
                    if (productId === content.id) {
                        productPriceEl.val(content.price);
                        return false;
                    }
                });
            }
        });

        productQtyActionEl.delegate('span', 'click', function () {
            var trim = $.trim;
            return function (e) {
                var $this = $(this), action = trim($this.attr('data-action')), qty = parseInt(productQtyEl.val() || 0);
                switch (action) {
                    case 'add':
                        productQtyEl.val(++qty);
                        break;
                    case 'minus' :
                        productQtyEl.val(qty <= 0 ? 0 : --qty);
                        break;
                }
            };
        }());

        $('#add-to-order').click(function (e) {
            e.preventDefault();
            var template, $this = $(this) , html;
            template = $this.data('template');
            if (!template) {
                template = $.trim($('#product-detail-template').html());
                $this.data('template', template);
            }
            var data = {
                category_id: categoryEl.val(),
                category_name: categoryEl.find('option:selected').text(),
                product_id: productEl.val(),
                product_name: productEl.find('option:selected').text(),
                product_price: parseFloat(productPriceEl.val()),
                product_qty: parseFloat(productQtyEl.val())
            };
            html = utils.template(template, data);
            $('#order-detail-holder').find('tbody').append(html);
        });

        $('#clear-order').click(function(e){
            e.preventDefault();
            $('#order-detail-holder').find('tbody').empty();
        });
    });
});