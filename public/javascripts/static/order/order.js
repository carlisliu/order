/**
 * Created by Carlis on 4/13/15.
 */
define(function (require, exports, module) {
    var $ = require('jquery');

    function Detail(detail) {
        if (detail) {
            this.gid = Detail.guid++;
            this.category_id = detail.category_id || '';
            this.category_name = detail.category_name || '';
            this.product_id = detail.product_id || '';
            this.product_name = detail.product_name || '';
            this.product_price = detail.product_price || '';
            this.product_qty = detail.product_qty || 0;
        }
    }

    Detail.guid = 0;

    Detail.prototype = {
        setData: function (container) {
            var that = this;
            if ($.isPlainObject(container)) {
                $.extend(this, container);
            } else {
                container = typeof container === 'string' ? $(container) : container;
                $(container).find('td').each(function (index, content) {
                    // that[]
                });
            }
            return this;
        }
    };

    function Order(customer, details) {
        this.customer = customer;
        this.details = details;
    }

    Order.prototype = {
        save: function (order, callback) {
            if (order) {
                $.post('/order/add.html', {order: order}).done(function (data) {
                    callback(null, data.order);
                }).fail(function (e) {
                        callback(e);
                    });
            } else {
                callback(new Error('Order is empty.'));
            }
            return this;
        },
        getTotal: function () {
            var total = 0;
            $.each(this.details, function (index, detail) {
                total += parseFloat(detail.product_price);
            });
            return total;
        },
        addDetail: function (detailOrder) {
            var detail = new Detail(detailOrder);
            (this.details || (this.details = [])).push(new Detail(detail));
            return detail.gid;
        },
        removeDetail: function (gid) {
            var that = this;
            if (gid) {
                $.each(that.details, function (index, content) {
                    if (content.gid === gid) {
                        that.details.splice(index);
                        return false;
                    }
                });
            }
            return this;
        }
    };

    module.exports = {
        Order: Order,
        Detail: Detail
    };
});