define('static/user/event', ['jquery', 'Vue', './user'], function(require, exports, module) {
    var $ = require('jquery');
    var Vue = require('Vue');
    var User = require('./user');

    var userData = $.trim($('#container').val());
    userData = $.parseJSON(userData || {});

    var vm = new Vue({
        el: '#user'
        data: new User(userData),
        computed: {

        },
        methods: {}
    });

    module.exports = vm;
});