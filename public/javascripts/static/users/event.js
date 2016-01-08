define('static/users/event', ['jquery', 'validate', 'jgrowl', './user', '../common/options', '../common/modal'], function(require) {
	var $ = require('jquery');
	var User = require('./user');
	require('validate');
	require('jgrowl');
	var validateOptions = require('../common/options');
	var Modal = require('../common/modal');

	var DIGIT = /(\d+)/;

	$.validator.setDefaults({
		onsubmit: false
	});

	function decreaseTotal () {
		var totalInfo = $('.dataTables_info');
		var total = DIGIT.exec(totalInfo.text())[1];
		total = parseInt(total);
		if (!isNaN(total) && total > 0) {
			--total;
			if (total > 1) {
				totalInfo.text(total + ' entries');
			} else {
				totalInfo.text(total + ' entry');
			}
		}
	}

	$(function() {
		var user = new User('#user-form');

		$(document.body).on('click', '#save-user', function(e) {
			e.preventDefault();
			var form = $('.validate');
			form.validate(validateOptions);
			if (form.valid()) {
				user.post('/users/add.html', function(data) {
					if (data.status == 'success') {
						user.clearInput();
					}
					$.jGrowl(data.message || 'Saved.');
				});
			}
		}).on('click', 'table#users-holder a.deleteRow', function(e) {
			e.preventDefault();
			var $this = $(this);
			var modal = new Modal('#info-modal');
			modal.setTitle('Warning').setBody('<p>Do you wanna remove this user?</p>').bindFooter('danger', function() {
				user.remove($this.attr('data-user-id'), function(data) {
					if (data.status === 'success') {
						$this.parents('tr').remove();
						decreaseTotal();
						return $.jGrowl(data.message || 'Removed.');
					}
					$.jGrowl(data.message || 'Error.');
				});
			});
		}).on('click', 'table#users-holder a.updateRow', function(e) {
			e.preventDefault();
		});
	});
});