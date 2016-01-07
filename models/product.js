/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
    id: {type: String, unique: true},
    company_id: {type: Schema.ObjectId},
    category_id: {type: String},
    name: {type: String},
    price: {type: Number},
    picture_uri: [String],
    memo: {type: String},
    create_at: {type: Date, default: Date.now}
});

mongoose.model('Product', ProductSchema);