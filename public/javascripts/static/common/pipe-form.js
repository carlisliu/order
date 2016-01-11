define('static/common/pipe-form', ['jquery', '../utils/index'], function(require, exports, module) {
	var $ = require('jquery');
	var util = require('../utils/index');

	function wrap(element) {
		return element instanceof $ ? element : $(element);
	}

	function unwrap(element) {
		return typeof element === 'string' ? $.trim(element) : $.trim(element.html());
	}

	var defaultOption = {
		collections: {}
	};

	function PipeForm(options) {
		this.options = $.extend({}, defaultOption, options);
		this.container = wrap(options.container);
		this._set = {};
		this.form = null;
	}

	PipeForm.prototype = {
		pull: function(entity) {
			entity = entity || $.parseJSON(this.container.find('input[data-entity=entity]').val());
			var _set = this._set,
				options = this.options;
			_set.entity = entity || {};
			this.container.find('[data-type]').each(function() {
				var $this = $(this);
				var type = $this.attr('data-type');
				if (type) {
					var key = $this.attr('data-property');
					_set.special = _set.special || {};
					_set.special[key] = {
						key: key,
						type: type,
						collections: options.collections[key] || ($this.attr('data-collections') ? $.parseJSON($this.attr('data-collections')) : null)
					};
				}
			});
			return this;
		},
		pipe: function(form) {
			form = util.template(unwrap(form), this._set.entity);
			form = wrap(form);
			var special = this._set.special;
			if (special) {
				for (var key in special) {
					if (special[key].type === 'select') {
						var select = form.find('select[data-property=' + key + ']');
						util.bindSelector(select, special[key].collections || {}, this._set.entity[key]);
					} else if (special[key].type === 'checkbox') {
						form.find('input[type=checkbox][data-property=' + key + ']').attr('checked', this._set.entity[key]);
					}
				}
			}
			this.form = form;
			return this;
		},
		html: function() {
			return this.form ? $.trim(this.form.html()) : '';
		}
	};

	module.exports = PipeForm;
});