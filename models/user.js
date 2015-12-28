/**
 * Created by Carlis on 12/28/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: {type: String, unique: true},
    name: {type: String},
    password: {type: String},
    create_at: {type: Date, default: Date.now}
});

mongoose.model('User', UserSchema);