/**
 * Created by Carlis on 5/4/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema({
    id: {type: Schema.ObjectId},
    name: {type: String},
    address: {type: String},
    phone: {type: String}
});

mongoose.model('Company', CompanySchema);