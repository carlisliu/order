/**
 * Created by Carlis on 4/15/15.
 */

define(function (require, exports, module) {
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
            var actionEl = this.container.find('.modal-footer a'), targetEl;
            targetEl = $(actionEl[1]);
            if (mode === 'confirm') {
                targetEl.removeClass('btn-danger').addClass('btn-primary');
            } else {
                targetEl.removeClass('btn-primary').addClass('btn-danger');
            }
            targetEl.one('click', callback || function () {
            });
            return this;
        }
    };

    module.exports = Modal;
});