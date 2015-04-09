/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
    id: {type: String, unique: true},
    name: {type: String},
    memo: {type: String},
    create_at: {type: Date, default: Date.now}
});

mongoose.model('Category', CategorySchema);