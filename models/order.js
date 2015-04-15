/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


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
});

mongoose.model('Order', OrderSchema);