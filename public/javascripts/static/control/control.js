define('static/control/control', ['jquery', 'jgrowl'], function(require, exports, module) {
	var $ = require('jquery');
	require('jgrowl');

	function Control(record) {
		this.record = record;
		this.loading = '/images/loading.gif';
		this.finished = '/images/action_check.png';
	}

	Control.prototype = {
        constructor: Control,
		before: function() {
			if (this.record) {
				var record = $.isArray(this.record) ? this.record : [this.record];
				var that = this;
				$.each(record, function (record) {
					record.find('td:last').html(that.render(that.loading));
				});
			}
			return this;
		},
		finish: function() {
			if (this.record) {
				var record = $.isArray(this.record) ? this.record : [this.record];
				var that = this;
				$.each(record, function (record) {
					record.find('td:last').html(that.render(that.finished));
				});
			}
			return this;
		},
		error: function  (msg) {
			if (this.record) {
				var record = $.isArray(this.record) ? this.record : [this.record];
				var that = this;
				$.each(record, function (record) {
					record.find('td:last').html('');
					$.jGrowl(msg || 'Error');
				});
			}
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