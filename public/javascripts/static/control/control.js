define('static/control/control', ['jquery'], function(require, exports, module) {
	var $ = require('jquery');

	function Control(record) {
		this.record = record;
		this.loading = '/images/loading.gif';
		this.finished = '/images/action_check.png';
	}

	Control.prototype = {
		before: function() {
			this.record.find('td:last').html(this.render(this.loading));
			return this;
		},
		finish: function(argument) {
			this.record.find('td:last').html(this.render(this.finished));
			return this;
		},
		render: function(src) {
			return '<img src="' + src + '" />';
		},
		import: function(table, callback) {
			var that = this;
			this.before();
			$.post('/control/table.html', data, function(data) {
				callback(data);
				that.finish();
			});
		}
	};

	module.exports = Control;
});