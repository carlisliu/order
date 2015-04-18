/**
 * Created by Carlis on 4/12/15.
 */
define(function (require) {
    var $ = require('jquery'), msg = window.msg, Product = require('./product'), Modal, utils, validateOpts = {
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
    require('bootstrap.modal');
    Modal = require('../common/modal');
    require('jgrowl');
    utils = require('utils');

    if (msg && 'null' !== msg) {
        $.jGrowl(msg);
        msg = null;
    }

    $.validator.setDefaults({
        onsubmit: false
    });

    $(function () {
        $('#save-product').click(function (e) {
            e.preventDefault();
            var form = $('.validate');
            form.validate(validateOpts);
            if (form.valid()) {
                var product = new Product('#product-form');
                product.save(function (err, data) {
                    if (data) {
                        product.clear();
                        $.jGrowl(data.msg || 'Saved.');
                    } else {
                        $.jGrowl('Error occurs.' + e ? e.toString() : '');
                    }
                });
            }
        });

        $('#products-holder').delegate('tbody a', 'click', function (e) {
            e.preventDefault();
            var modal = new Modal('#info-modal'), $this = $(this), el , data = {}, trim = $.trim, trEl;
            data.id = (trEl = $this.parents('tr')).attr('data-product-id');
            if ($this.hasClass('deleteRow')) {
                modal.setTitle('Warning').setBody('<p>Do you wanna remove this product?</p>').bindFooter('danger', function () {
                    new Product().remove(data.id, function (err, data) {
                        if (!err) {
                            trEl.remove();
                        }
                        $.jGrowl(err ? err.toString() : data.msg);
                    });
                });
            } else {
                data.name = trim(trEl.find('td:first-child').attr('data-product-name'));
                data.category_id = trim(trEl.find('td:nth-child(2)').attr('data-product-category'));
                data.price = trim(trEl.find('td:nth-child(3)').attr('data-product-price'));
                data.memo = trim(trEl.find('td:nth-child(4)').attr('data-product-memo'));
                el = trim($('#product-form-template').html());
                el = $(utils.template(el, data));
                utils.bindSelector(el.find('#product-category'), JSON.parse(trim($('#category-data').html())));
                modal.setTitle('Change Category Info').setBody(el.html()).bindFooter('confirm', function (modal) {
                    var form = modal.find('.validate'), product;
                    form.validate(validateOpts);
                    if (form.valid()) {
                        product = {
                            id: data.id,
                            name: trim(form.find('#product-name').val()),
                            category_id: trim(form.find('#product-category').val()),
                            price: parseFloat(trim(form.find('#product-price').val())),
                            memo: trim(form.find('#product-memo').val())
                        };
                        $.post('/product/update.html', {product: product}).done(function (data) {
                            var product = data.product;
                            trEl.find('td:first-child').attr('data-product-name', product.name);
                            trEl.find('td:first-child').html(product.name);
                            trEl.find('td:nth-child(2)').attr('data-product-category', product.category_id);
                            trEl.find('td:nth-child(2)').html(product.category_name);
                            trEl.find('td:nth-child(3)').attr('data-product-price', product.price);
                            trEl.find('td:nth-child(3)').html(product.price);
                            trEl.find('td:nth-child(4)').attr('data-product-memo', product.memo);
                            trEl.find('td:nth-child(4)').html(product.memo);
                            $.jGrowl(data.msg);
                        }).fail(function (e) {
                                $.jGrowl(e.toString());
                            });
                        return true;
                    }
                    return false;
                });
                modal.container.find('#product-category').val(data.category_id);
            }
        });

    });
});