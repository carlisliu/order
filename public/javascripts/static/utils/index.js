/**
 * Created by Carlis on 4/12/15.
 */
define('static/utils/index', ['jquery'], function(require) {
    var $ = require('jquery');

    function generate(type) {
        return function(argument) {
            window.console && console[type].apply(console, arguments);
        }
    }

    return {
        template: function(tmpl, data) {
            return tmpl.replace(/\{(\w+.?\w+)\}/g, function(m, i) {
                var result = typeof data[i] === 'object' ? JSON.stringify(data[i]) : data[i];
                return result || '';
            }).replace(/\{(\d+)\}/g, function(m, i) {
                var result = typeof data[i] === 'object' ? JSON.stringify(data[i]) : data[i];
                return result || '';
            });
        },
        bindSelector: function(selector, data) {
            selector.empty();
            if (data) {
                var options = '<option value="" selected="selected">Choose One</option>';
                for (var key in data) {
                    options += '<option value="' + key + '">' + data[key] + '</option>';
                }
                selector.append(options);
            }
            return selector;
        },
        convert: function(data, key, val) {
            var result = {};
            if ($.isArray(data)) {
                $.each(data, function(index, content) {
                    result[content[key]] = content[val];
                });
            }
            return result;
        },
        log: generate('log'),
        debug: generate('debug')
    }
});