/**
 * Created by Carlis on 4/12/15.
 */

define('static/category/event', ['validate', 'jgrowl', '../common/modal', '../utils/index'], function (require, exports, module) {
    var $ = require('jquery');
    var validateOpts = {
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
    require('jgrowl');
    var Modal = require('../common/modal');
    var utils = require('../utils/index');

    $.validator.setDefaults({
        onsubmit: false
    });

    $(function () {
        var Category = require('./category');
        $('#save-category').click(function (e) {
            e.preventDefault();
            var form = $('.validate');
            form.validate(validateOpts);
            if (form.valid()) {
                var category = new Category('#category-form');
                category.save(function (err, data) {
                    if (data) {
                        category.clear();
                        $.jGrowl(data.msg || 'Saved.');
                    } else {
                        $.jGrowl('Error occurs.' + e ? e.toString() : '');
                    }
                });
            }
        });

        $('#customers-holder').delegate('tbody a', 'click', function (e) {
            e.preventDefault();
            var modal = new Modal('#info-modal'), $this = $(this), el , data = {}, trim = $.trim, trEl;
            data.id = (trEl = $this.parents('tr')).attr('data-category-id');
            if ($this.hasClass('deleteRow')) {
                modal.setTitle('Warning').setBody('<p>Remove this category will also delete all the products under this category, do you wanna proceed?</p>').bindFooter('danger', function () {
                    new Category().remove(data.id, function (err, data) {
                        if (!err) {
                            trEl.remove();
                        }
                        $.jGrowl(err ? err.toString() : data.msg);
                    });
                });
            } else {
                data.name = trim(trEl.find('td:first-child').attr('data-category-name'));
                data.memo = trim(trEl.find('td:nth-child(2)').attr('data-category-memo'));
                el = trim($('#category-form-template').html());
                modal.setTitle('Change Category Info').setBody(utils.template(el, data)).bindFooter('confirm', function (modal) {
                    var form = modal.find('.validate'), category;
                    form.validate(validateOpts);
                    if (form.valid()) {
                        category = {
                            id: data.id,
                            name: trim(form.find('#category-name').val()),
                            memo: trim(form.find('#category-memo').val())
                        };
                        $.post('/category/update.html', {category: category}).done(function (data) {
                            trEl.find('td:first-child').attr('data-category-name', category.name);
                            trEl.find('td:first-child').html(category.name);
                            trEl.find('td:nth-child(2)').attr('data-category-memo', category.memo);
                            trEl.find('td:nth-child(2)').html(category.memo);
                            $.jGrowl(data.msg);
                        }).fail(function (e) {
                                $.jGrowl(e.toString());
                            });
                        return true;
                    }
                    return false;
                });
            }
        });
    });
});
