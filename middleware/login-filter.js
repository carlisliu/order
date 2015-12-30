var STATIC_URL = /(\.(js|css|jpeg|jpg|png|gif))$/;
exports = module.exports = function (req, res,next) {
	if (!req.session || !req.session.user) {
        if (req.url !== '/users/login' && !isStaticFile(req.url)) {
            return res.redirect('/users/login');
        }
    }
    next();
};

function isStaticFile (url) {
    return url && STATIC_URL.test(url);
}