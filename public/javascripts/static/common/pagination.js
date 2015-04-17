/**
 * Created by Carlis on 4/17/15.
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
        defaultOption = {
            pageSize: 10
        };

    $.fn.extend({
        pagination: function (option) {
            var opts = $.extend({}, defaultOption, option),
                currentPage = opts.currentPage || 1,
                pageSize = opts.pageSize,
                totalSize = opts.totolSize || 0;
            if(totalSize <= pageSize ){
                return this;
            }


        }
    });
});