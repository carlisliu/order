/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
    no: {type: String, unique: true},
    customer_id: {type: String},
    customer_name: {type: String},
    customer_tel: {type: String},
    customer_address: {
        street: String,
        city: String,
        country: String},
    details: [],
    memo: {type: String},
    create_at: {type: Date, default: Date.now}
});

mongoose.model('Order', OrderSchema);