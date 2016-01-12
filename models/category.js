/**
 * Created by Carlis on 4/8/15.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CategorySchema = new Schema({
	id: {
		type: String
	},
	company_id: {
		type: Schema.ObjectId
	},
	name: {
		type: String
	},
	memo: {
		type: String
	},
	create_at: {
		type: Date,
		default: Date.now
	}
});

CategorySchema.index({
	company_id: 1,
	name: 1
}, {
	unique: true
});

mongoose.model('Category', CategorySchema);