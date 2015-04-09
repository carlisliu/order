/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    id: {type: String},
    name: {type: String},
    tel: {type: String},
    address: {type: String}
});

mongoose.model('Customer', CustomerSchema);