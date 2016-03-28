/**
 * Created by Carlis on 4/13/15.
 */
define('static/order/event', ['jquery', 'validate', 'validate.extend', 'jgrowl', './order', '../customer/customer', '../product/product', '../utils/index'], function (require) {
    var $ = require('jquery'),
        Order = require('./order').Order,
        Detail = require('./order').Detail,
        Customer = require('../customer/customer'),
        customer = new Customer('#customer-form'),
        Product = require('../product/product'),
        product = new Product(),
        utils = require('../utils/index'),
        orderDetails = {},
        validationOpts = {
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

    require('jgrowl');
    require('validate');
    require('validate.extend');
    $.validator.setDefaults({
        onsubmit: false
    });

    $(function () {
        var categoryEl, productEl, productQtyActionEl, productPriceEl, productQtyEl, orderDetailEl;
        $('#customer-id').change(function () {
            var id = $(this).val();
            if (!id) {
                customer.clear();
                return this;
            }
            customer.getCustomerById($(this).val(), function (customerItem) {
                if (customerItem) {
                    customer.setData(customerItem);
                }
            });
        });

        categoryEl = $('#category-id');
        productEl = $('#product-id');
        productQtyActionEl = $('#product-qty-actions');
        productPriceEl = $('#product-price');
        productQtyEl = $('#product-qty');
        orderDetailEl = $('#order-detail-holder');

        categoryEl.change(function () {
            var categoryId = categoryEl.val();
            if (categoryId) {
                product.getProductByCategoryId(categoryId, function (err, data) {
                    var msg = err || data.msg || '', products;
                    msg && $.jGrowl(msg);
                    if ((products = data.products)) {
                        productEl.data('productsData', products);
                        utils.bindSelector(productEl, utils.convert(products, '_id', 'name'));
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
                    if (productId === content._id) {
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

        orderDetailEl.delegate('a.deleteRow', 'click', function (e) {
            e.preventDefault();
            var trEl = $(this).parents('tr');
            delete orderDetails[trEl.attr('order-detail-id')];
            orderDetailEl.find('tbody tr:last').find('td:nth-child(5)').html(getTotal(orderDetails));
            trEl.remove();
        });

        function getTotal(productDetails) {
            var total = 0;
            $.each(productDetails, function (key, detail) {
                total += (detail.product_price * detail.product_qty);
            });
            return total.toFixed(2);
        }

        function validateProduct() {
            var form = $('#product-form');
            form.validate(validationOpts);
            return form.valid();
        }

        function validateCustomer() {
            var form = $('#customer-form');
            form.validate(validationOpts);
            return form.valid();
        }

        $('#add-to-order').click(function (e) {
            e.preventDefault();
            var template, $this = $(this) , html, price, qty, detail;
            if (validateProduct()) {
                template = $this.data('template');
                if (!template) {
                    template = $.trim($('#product-detail-template').html());
                    $this.data('template', template);
                }
                price = parseFloat(productPriceEl.val());
                qty = parseFloat(productQtyEl.val());
                var data = {
                    category_id: categoryEl.val(),
                    category_name: categoryEl.find('option:selected').text(),
                    product_id: productEl.val(),
                    product_name: productEl.find('option:selected').text(),
                    product_price: price,
                    product_qty: qty,
                    total: (qty * price).toFixed(2)
                };
                detail = new Detail(data);
                orderDetails[detail.gid] = detail;
                html = $(utils.template(template, data));
                html.attr('order-detail-id', detail.gid);
                orderDetailEl.find('tbody').prepend(html);
                orderDetailEl.find('tbody tr:last').find('td:nth-child(5)').html(getTotal(orderDetails));
            }
        });

        $('#save-order').click(function (e) {
            var order, getDetail = function (details) {
                var result = [];
                $.each(details, function (key, detail) {
                    result.push(detail.getData());
                });
                return result;
            }
            e.preventDefault();
            if (validateCustomer()) {
                if ($.isEmptyObject(orderDetails)) {
                    $.jGrowl('Please select at least one product');
                } else {
                    order = new Order({
                        customer_id: customer.id,
                        customer_name: customer.name,
                        customer_tel: customer.tel,
                        customer_shopName: customer.shopName,
                        customer_address: customer.address
                    }, getDetail(orderDetails));
                    order.save(order.getData(), function (err, data) {
                        if (err) {
                            $.jGrowl(err.toString());
                        } else {
                            $.jGrowl('Saved.');
                        }
                    });
                }
            }
        });

        $('#clear-order').click(function (e) {
            e.preventDefault();
            orderDetails = {};
            orderDetailEl.find('tbody tr:last').find('td:nth-child(5)').html(0);
            orderDetailEl.find('tbody tr[data-total!="total"]').remove();
        });
    });
});