var STATIC_URL = /(\.(js|css|jpeg|jpg|png|gif))$/;
var API_URL = /\/api\//i;

exports = module.exports = function(req, res, next) {
	if (!req.session || !req.session.user) {
		var url = req.url;
		if (url !== '/users/login' && !isStaticFile(url) && !isApi(url)) {
			return res.redirect('/users/login');
		}
	}
	next();
};

function isStaticFile(url) {
	return url && STATIC_URL.test(url);
}

function isApi(url) {
	return url && API_URL.test(url);
}