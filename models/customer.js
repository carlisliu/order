/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    company_id: {
        type: Schema.ObjectId
    },
    name: {
        type: String,
        index: true
    },
    tel: {
        type: String
    },
    address: {
        street: String,
        city: String,
        country: String
    },
    create_at: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true
    }
});

CustomerSchema.index({
    company_id: 1,
    name: 1
}, {
    unique: true
});

CustomerSchema.virtual('fullAddress').get(function() {
    var result = [this.address.street, this.address.city, this.address.country].filter(function(part) {
        return !!part;
    });
    return result.join(',');
});

mongoose.model('Customer', CustomerSchema);