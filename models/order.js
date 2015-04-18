/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment');


var OrderDetailSchema = new Schema({
    category_id: {type: String},
    category_name: {type: String},
    product_id: {type: String},
    product_name: {type: String},
    product_price: {type: Number},
    product_qty: {type: Number}
});

mongoose.model('OrderDetail', OrderDetailSchema);

var OrderSchema = new Schema({
    no: {type: String, unique: true},
    customer_id: {type: String},
    customer_name: {type: String},
    customer_tel: {type: String},
    customer_address: {
        street: String,
        city: String,
        country: String},
    details: [OrderDetailSchema],
    memo: {type: String},
    create_at: {type: Date, default: Date.now}
}, {
    toJSON: {virtuals: true}
});

OrderSchema.virtual('order_date').get(function () {
    return moment(this.create_at).format('YYYY-MM-DD');
});

OrderSchema.virtual('total').get(function () {
    var sum = 0;
    if (this.details) {
        this.details.forEach(function (content) {
            sum += (content.product_price * content.product_qty);
        });
    }
    return sum.toFixed(2);
});

mongoose.model('Order', OrderSchema);