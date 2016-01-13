define('static/control/control', ['jquery', 'jgrowl'], function(require, exports, module) {
	var $ = require('jquery');
	require('jgrowl');

	function Control(record) {
		this.record = record;
		this.loading = '/images/loading.gif';
		this.finished = '/images/action_check.png';
	}

	Control.prototype = {
		before: function() {
			this.record && this.record.find('td:last').html(this.render(this.loading));
			return this;
		},
		finish: function() {
			this.record && this.record.find('td:last').html(this.render(this.finished));
			return this;
		},
		error: function  (msg) {
			this.record && this.record.find('td:last').html('');
			$.jGrowl(msg || 'Error');
			return this;
		},
		render: function(src) {
			return '<img src="' + src + '" />';
		},
		import: function(data, callback) {
			var that = this;
			this.before();
			$.post('/control/table.html', data, function(data) {
				if (data.status === 'success') {
					that.finish();
				} else {
					that.error(data.message);
				}
				callback(data);
			}).fail(function (e) {
				that.error(e.message);
			});
		}
	};

	module.exports = Control;
});