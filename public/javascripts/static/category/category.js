/**
 * Created by Carlis on 4/12/15.
 */
define('static/category/category', function (require, exports, module) {
    var $ = require('jquery');

    function Category(container) {
        if (container) {
            this.container = container = typeof container === 'string' ? $(container) : container;
            this.name = container.find('#category-name').val();
            this.memo = container.find('#category-memo').val();
        }
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
        },
        remove: function (id, callback) {
            if (id) {
                $.post('/category/remove.html', {id: id}).done(function (data) {
                    callback(null, data);
                }).fail(function (e) {
                        callback(e);
                    });
            } else {
                callback(new Error("Category's id is empty."));
            }
            return this;
        },
        clear: function () {
            if (this.container) {
                this.container.find('input[type="text"]').val('');
                this.id = this.name = this.memo = null;
                this.clearStyle();
            }
            return this;
        },
        clearStyle: function () {
            this.container && this.container.find('.control-group').removeClass('error success');
            return this;
        }
    };

    module.exports = Category;
});
