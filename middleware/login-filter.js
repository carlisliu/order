exports = module.exports = function (req, res,next) {
	if (!req.session || !req.session.user) {
        if (req.url !== '/users/login' /*&& !isStaticFile()*/) {
            return res.redirect('/users/login');
        }
    }
    next();

    function isStaticFile (url) {
        return url && url.test(/(\.[a-zA-Z0-9]+)$/);
    }
};