define('static/common/base', ['jquery', '../utils/index'], function(require, exports, module) {

	var $ = require('jquery');
	var util = require('../utils/index');

	function noop() {}

	var defaultOption = {
		onerror: function(e) {
			util.error('error occurs, %o', e);
		}
	};

	function Base(option) {
		var instance;
		option = option || {};
		if (typeof option !== 'object' || (instance = option instanceof $)) {
			option = {
				container: instance ? option : $(option)
			}
		}
		option = $.extend(defaultOption, option);
		this.container = option.container || $(document.body);
		if (typeof this.container === 'string') {
			this.container = $(this.container);
		}
		this.onerror = option.onerror;
		this.data = {};
	}

	module.exports = Base;

	Base.prototype = {
		collectData: function() {
			var that = this;
			this.container.find('input[type=text], input[type=password], input[type=checkbox], select, textarea').each(function() {
				var $this = $(this),
					prop = $this.attr('data-property');
				if (prop) {
					if (this.type === 'checkbox') {
						that.data[prop] = $this.is(':checked');
					} else {
						that.data[prop] = $.trim($this.val());
					}
				}
			});
			return this;
		},
		getData: function() {
			return this.data;
		},
		post: function(directPost, url, data, callback) {
			var that = this,
				postData;
			if (typeof directPost !== 'boolean') {
				callback = data;
				data = url
				url = directPost;
				directPost = false;
			}
			if (typeof data === 'function') {
				callback = data;
				data = null;
			}
			postData = directPost ? $.extend({}, data || {}) : $.extend({}, this.collectData().getData(), data || {});
			util.debug('url:%s, post data: %o', url, postData);
			if (this.fixData && !directPost) {
				postData = this.fixData(postData);
				util.debug('url:%s, fixed data: %o', url, postData);
			}
			$.post(url, postData).done(function(data) {
				callback(data);
			}).fail(function(e) {
				(that.onerror || noop).call(this, e);
			});
			return this;
		}
	};
});