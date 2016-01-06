define('static/menu/index', ['jquery'], function(require) {
	var $ = require('jquery');
	$('.main-nav > li.active > a').click(function(e) {
		if ($(window).width() <= 767) {
			e.preventDefault();
			if ($(this).hasClass('open') && (!$(this).hasClass('toggle-collapsed'))) {
				$(this).removeClass('open');
				$(this).parents('.main-nav').find('li').each(function() {
					$(this).find('.collapsed-nav').addClass('closed');
					$(this).hide();
				});
				$(this).parent().show();
				$(this).parent().removeClass('open');
			} else {
				if ($(this).hasClass('toggle-collapsed')) {
					$(this).parent().addClass('open');
				}
				if ($(this).hasClass("open")) {
					$(this).parents('.main-nav').find('li').not('.active').each(function() {
						$(this).find('.collapsed-nav').addClass('closed');
						$(this).hide();
					});
					$(this).removeClass("open");
				} else {
					$(this).addClass('open');
					$(this).parents('.main-nav').find('li').show();
				}
			}
		}
	});

	$('.toggle-collapsed').each(function() {
		if ($(this).hasClass('on-hover')) {
			$(this).click(function(e) {
				e.preventDefault();
			});
			$(this).parent().hover(function() {
				$(this).addClass("open");
				$(this).find('.collapsed-nav').slideDown();
				$(this).find('img').attr("src", '/images/toggle-subnav-up-white.png');
			}, function() {
				$(this).removeClass("open");
				$(this).find('.collapsed-nav').slideUp();
				$(this).find('img').attr("src", '/images/toggle-subnav-down.png');
			});
		} else {
			$(this).click(function(e) {
				e.preventDefault();
				if ($(this).parent().find('.collapsed-nav').is(":visible")) {
					$(this).parent().removeClass("open");
					$(this).parent().find('.collapsed-nav').slideUp();
					$(this).find('img').attr("src", '/images/toggle-subnav-down.png');
				} else {
					$(this).parent().addClass("open");
					$(this).parent().find('.collapsed-nav').slideDown();
					$(this).find('img').attr("src", '/images/toggle-subnav-up-white.png');
				}
			});
		}
	});

	$('.collapsed-nav li a').hover(function() {
		if (!$(this).parent().hasClass('active')) {
			$(this).stop().animate({
				marginLeft: '5px'
			}, 300);
		}
	}, function() {
		$(this).stop().animate({
			marginLeft: '0'
		}, 100);
	});

	$(document.body).on('keyup', '#find-order', function (e) {
		var val;
		if (e.keyCode == 13) {
			val = $.trim($(this).val());
			if (/^\d+$/.test(val)) {
				window.location.href = '/order/list.html?no=' + val;
			} else if (Date.parse && Date.parse(val)){
				window.location.href = '/order/list.html?date=' + val;
			} else {
				alert('Wrong format of search condition');
			}
		}
	});
});