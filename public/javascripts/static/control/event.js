define('static/control/event', ['jquery', './control', 'jgrowl', '../common/options', 'validate'], function(require, exports, module) {
	var $ = require('jquery');
	var Control = require('./control');
	require('validate');
	require('jgrowl');
	var validateOptions = require('../common/options');

	$(function() {
		$(document.body).on('click', '#tables-holder th input[type=checkbox]', function(e) {
			var $this = $(this);
			if ($this.is(':checked')) {
				$this.parents('table').find('tbody input[type=checkbox]').prop('checked', true);
			} else {
				$this.parents('table').find('tbody input[type=checkbox]').prop('checked', false);
			}
		}).on('click', '#tables-holder td input[type=checkbox]', function(e) {
			var $this = $(this);
			var allChecked = true;
			if ($this.is(':checked')) {
				if ($this.attr('data-table') === 'Product') {
					$this.parents('tr').siblings().find('input[type=checkbox][data-table=Category]').prop('checked', true);
				}
				$this.parents('tr').siblings().find('input[type=checkbox]').each(function() {
					if (!$(this).is(':checked')) {
						return (allChecked = false);
					}
				});
			} else {
				if ($this.attr('data-table') === 'Category') {
					$this.parents('tr').siblings().find('input[type=checkbox][data-table=Product]').prop('checked', false);
				}
				allChecked = false;
			}
			$this.parents('table').find('thead input[type=checkbox]').prop('checked', allChecked);
		}).on('click', 'button', function(e) {
			var form = $('.validate');
			form.validate(validateOptions);
			if (!form.valid()) {
				return;
			}
			var source = $('#source').val();
			var destination = $('#destination').val();
			if (source === destination) {
				return $.jGrowl('Source and destination can not be identical.');
			}
			var tables = {};
			$('#tables-holder').find('tbody tr').filter(function() {
				return $(this).find('input[type=checkbox]').is(':checked');
			}).each(function() {
				var $this = $(this);
				var table = $this.attr('data-table');
				tables[table] = {
					table: table,
					target: $this
				};
			});

			var ctrl;
			if (tables['Category'] && tables['Product']) {
				ctrl = new Control([tables['Category'].target, tables['Product'].target]);
				ctrl.import({
					table: ['Category', 'Product'],
					source: source,
					destination: destination
				}, function(data) {
				});
				delete tables['Category'];
				delete tables['Product'];
			}

			for(var key in tables) {
				ctrl = new Control(tables[key].target);
				ctrl.import({
					table: tables[key].table,
					source: source,
					destination: destination
				}, function(data) {
				});
			}
		});
	});
});