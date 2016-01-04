/**
 * Created by Carlis on 5/4/15.
 */

define('static/company/company', function(require, exports, module) {
    var $ = require('jquery');

    function Company(container) {
        this.container = container;
    }

    Company.prototype = {
        saveOrUpdate: function(company, callback) {
            $.post('/company/save.html', {
                company: company
            }).done(function(data) {
                callback(null, data);
            }).fail(function(e) {
                callback(e);
            });
            return this;
        },
        clear: function() {
            this.container && this.container.find('text').val('');
            return this;
        },
        setData: function(company) {
            var container = this.container;
            if (company) {
                container.find('#company-name').val(company.name || '');
                container.find('#company-address').val(company.address || '');
                container.find('#company-phone').val(company.phone || '');
            }
            return this;
        }
    };

    var company = new Company($('#settings-form'));
    $('#company-setting').click(function(e) {
        e.preventDefault();
        $.getJSON('/company/get.html', function(data) {
            if (data && data.company) {
                company.setData(data.company);
            } else {
                company.clear();
            }
        });
    });

    $('#setting-confirm').click(function(e) {
        e.preventDefault();
        var container = company.container;
        var companyItem = {
            name: container.find('#company-name').val(),
            address: container.find('#company-address').val(),
            phone: container.find('#company-phone').val()
        };
        company.saveOrUpdate(companyItem, function() {});
    });
    module.exports = Company;
});