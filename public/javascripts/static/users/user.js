define('static/users/user', ['jquery', '../utils/index', '../common/base'], function(require, exports, module) {
	var $ = require('jquery');
	var util = require('../utils/index');
	var Base = require('../common/base');

	function User(option) {
		Base.call(this, option);
	}
	util.inherits(User, Base);

	User.prototype.fixData = function(data) {
		return {
			user: data
		};
	};

	User.prototype.remove = function(id, callback) {
		this.post(true, '/users/remove.html', {
			id, id
		}, callback);
		return this;
	};

	User.prototype.clearInput = function() {
		if (this.container) {
			this.container.find('input[type=text], input[type=password], input[type=checkbox], select, textarea').each(function() {
				if (this.type === 'checkbox') {
					$(this).attr('checked', false);
				} else {
					$(this).val('');
				}
			});
		}
		return this;
	};

	module.exports = User;
});