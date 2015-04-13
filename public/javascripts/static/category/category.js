/**
 * Created by Carlis on 4/12/15.
 */
define(function (require, exports, module) {
    var $ = require('jquery');

    function Category(container) {
        container = typeof container === 'string' ? $(container) : container;
        this.name = container.find('#category-name').val();
        this.memo = container.find('#category-memo').val();
    }

    Category.prototype = {
        save: function (callback) {
            var category = {
                name: this.name,
                memo: this.memo
            };
            $.post('/category/add.html', {category: category}).done(function (data) {
                callback(null, data);
            }).fail(function (e) {
                    callback(e);
                });
            return this;
        }
    };

    module.exports = Category;
});
