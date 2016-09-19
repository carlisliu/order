define('static/user/event', ['jquery', 'Vue', './user'], function(require, exports, module) {
    var $ = require('jquery');
    var Vue = require('Vue');
    var User = require('./user');

    var userData = $.parseJSON($.trim($('#container').val()));

    var vm = new Vue({
        el: '#user'
        data: userData,
        compute: {

        },
        method: {}
    });

    module.exports = vm;
});