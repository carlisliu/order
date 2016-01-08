define('static/common/options', ['jquery'], function(require, exports, module) {
    var $ = require('jquery');
    module.exports = {
        errorPlacement: function(error, element) {
            element.parents('.controls').append(error);
        },
        highlight: function(label) {
            $(label).closest('.control-group').removeClass('error success').addClass('error');
        },
        success: function(label) {
            label.addClass('valid').closest('.control-group').removeClass('error success').addClass('success');
        }
    }
});