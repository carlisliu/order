/**
 * Created by Carlis on 4/15/15.
 */

define('static/common/modal', function (require, exports, module) {
    var $ = require('jquery');

    function Modal(container) {
        this.container = $(container);
    }

    Modal.prototype = {
        constructor: Modal,
        setTitle: function (title) {
            if (title) {
                this.container.find('.modal-header h3').html(title);
            }
            return this;
        },
        setBody: function (body) {
            if (body) {
                this.container.find('.modal-body').html(body);
            }
            return this;
        },
        bindFooter: function (mode, callback) {
            var actionEl = this.container.find('.modal-footer a'), targetEl, that = this;
            targetEl = $(actionEl[1]);
            if (mode === 'confirm') {
                targetEl.removeClass('btn-danger').addClass('btn-primary');
            } else {
                targetEl.removeClass('btn-primary').addClass('btn-danger');
            }
            targetEl.off('click');
            targetEl.on('click', function () {
                var _this = this;
                var result = $.proxy(callback || function () {
                }, this, that.container)();
                if (result === false){
                    targetEl.attr('data-cancel-close', 'true');
                } else {
                    targetEl.attr('data-cancel-close', 'false');
                }
            });
            return this;
        }
    };

    module.exports = Modal;
});