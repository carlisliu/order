/**
 * Created by Carlis on 4/12/15.
 */
define({
    template: function (tmpl, data) {
        return tmpl.replace(/\{(\w+)\}/g,function (m, i) {
            var result = typeof data[i] === 'object' ? JSON.stringify(data[i]) : data[i];
            return result || '';
        }).replace(/\{(\d+)\}/g, function (m, i) {
                var result = typeof data[i] === 'object' ? JSON.stringify(data[i]) : data[i];
                return result || '';
            });
    }
});
