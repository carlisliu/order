/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    id: {type: String},
    company_id: {type: Schema.ObjectId},
    name: {type: String, unique: true},
    tel: {type: String},
    address: {
        street: String,
        city: String,
        country: String
    },
    create_at: {type: Date, default: Date.now}
});

mongoose.model('Customer', CustomerSchema);