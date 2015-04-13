/**
 * Created by Carlis on 4/12/15.
 */
define(function (require, exports, module) {
    var $ = require('jquery');

    function Product(container) {
        if(container){
            container = typeof container === 'string' ? $(container) : container;
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
        }
    };

    module.exports = Product;
});