/**
 * Created by Carlis on 4/8/15.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderDetailSchema = new Schema({
    order_no: {type: String},
    product_id: {type: String},
    product_name: {type: String},
    product_price: {type: Number},
    product_qty: {type: Number}
});

mongoose.model('OrderDetail', OrderDetailSchema);