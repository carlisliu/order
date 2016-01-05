/**
 * Created by Carlis on 4/12/15.
 */
define('static/product/product', ['jquery'], function (require, exports, module) {
    var $ = require('jquery');

    function Product(container) {
        if (container) {
            this.container = container = typeof container === 'string' ? $(container) : container;
            this.name = container.find('#product-name').val();
            this.price = container.find('#product-price').val();
            this.category_id = container.find('#product-category').val();
            this.memo = container.find('#product-memo').val();
        }
    }

    Product.prototype = {
        save: function (callback) {
            var product = {
                name: this.name,
                price: this.price,
                category_id: this.category_id,
                memo: this.memo
            };
            $.post('/product/add.html', {product: product}).done(function (data) {
                callback(null, data);
            }).fail(function (e) {
                    callback(e);
                });
            return this;
        },
        getProductByCategoryId: function (categoryId, callback) {
            $.getJSON('/product/find.html/' + categoryId).done(function (data) {
                callback(null, data);
            }).fail(function (e) {
                    callback(e)
                });
        },
        remove: function (id, callback) {
            if (id) {
                $.post('/product/remove.html', {id: id}).done(function (data) {
                    callback(null, data);
                }).fail(function (e) {
                        callback(e);
                    });
            } else {
                callback(new Error("Product's id is empty."));
            }
            return this;
        },
        clear: function () {
            if (this.container) {
                this.container.find('input[type="text"],select').val('');
                this.id = this.name = this.memo = this.category_id = null;
                this.clearStyle();
            }
            return this;
        },
        clearStyle: function () {
            this.container && this.container.find('.control-group').removeClass('error success');
            return this;
        }
    };

    module.exports = Product;
});