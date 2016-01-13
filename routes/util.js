var message = {
	category: {
		'incomplete': 'Category info is incomplete.',
		'existed': 'Category already existed.'
	},
	customer: {
		'incomplete': 'Customer info is incomplete.',
		'existed': 'Customer already existed.'
	},
	product: {
		'incomplete': 'Product info is incomplete.',
		'existed': 'Product already existed.',
		'categoryIdEmpty': 'Category info is incomplete.',
		'duplicate': 'Product already exited at the same category.'
	}
};

exports.failObject = function(page) {
	return function(code) {
		var error = new Error((message[page] || {})[code] || 'Error');
		error.bizError = true;
		return error;
	};
};