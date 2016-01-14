/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProductSchema = new Schema({
	company_id: {
		type: Schema.ObjectId
	},
	category_id: {
		type: String
	},
	name: {
		type: String
	},
	price: {
		type: Number
	},
	picture_uri: [String],
	memo: {
		type: String
	},
	create_at: {
		type: Date,
		default: Date.now
	}
});

ProductSchema.index({
	company_id: 1,
	name: 1,
	category_id: 1
}, {
	unique: true
});

ProductSchema.index({
	category_id: 1,
	company_id: 1
}, {
	index: true
});

mongoose.model('Product', ProductSchema);