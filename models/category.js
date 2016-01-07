/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
    id: {type: String, unique: true},
    company_id: {type: Schema.ObjectId},
    name: {type: String, unique: true},
    memo: {type: String},
    create_at: {type: Date, default: Date.now}
});

mongoose.model('Category', CategorySchema);