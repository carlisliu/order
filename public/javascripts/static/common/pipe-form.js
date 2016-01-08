define('static/common/pipe-form', ['jquery', '../utils/index'], function(require, exports, module) {
	var $ = require('jquery');
	var util = require('../utils/index');

	function wrap(element) {
		return element instanceof $ ? element : $(element);
	}

	function unwrap(element) {
		return typeof element === 'string' ? element : element.html();
	}

	function PipeForm(container) {
		this.container = wrap(container);
		this._set = {};
		this.form = null;
	}

	PipeForm.prototype = {
		pull: function(entity) {
			entity = entity || $.parseJSON($('input[data-entity=entity]').val());
			var _set = this._set;
			_set.entity = entity || {};
			this.container.find('[data-type]').each(function() {
				var $this = $(this);
				var type = $this.attr('data-type');
				if (type) {
					_set.special = {
						key: $this.attr('data-key'),
						type: type,
						collections: $.parseJSON($this.attr('data-collections'))
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
					if (special.type === 'select') {
						var select = form.find('select[data-key=' + special.key + ']');
						util.bindSelector(select, special.collections);
						select.val(this._set.entity[key]);
					} else if (special.type === 'checkbox') {
						form.find('input[type=checkbox][data-key=' + special.key + ']').attr('checked', this._set.entity[key]);
					}
				}
			}
			this.form = form;
			return this;
		},
		bind: function(target, done) {
			if (this.form) {
				var that = this;
				this.form.find(target).on('click', function(e) {
					e.preventDefault();
					// validation goes here.
					done && done(formData);
				});
			}
			return this;
		}
	};

	function formData(form) {
		var data = {};
		form.find('[data-key]').each(function() {
			var $this = $(this);
			if (this.type === 'checkbox') {
				data[prop] = $this.is(':checked');
			} else {
				data[prop] = $.trim($this.val());
			}
		});
		return data;
	}

	module.exports = PipeForm;
});