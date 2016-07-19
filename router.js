var fs = require('fs');
var path = require('path');
var Router = require('koa-router');

function register(app) {
    var routes = fs.readdirSync('./routes');

    routes.map(function(route) {
        if (route) {
            route = route.replace(/^(\.+)/, '').replace(/(\.\w+)$/, '');
        }
        return route;
    }).filter(function(route) {
        return !!route;
    }).forEach(function(route) {
        var prefix = '/' + route;
        var router = require('./routes' + prefix);
        router.prefix(prefix);
        app.use(router.routes()).use(router.allowedMethods());
    });

    var router = new Router();
    router.get('/', function(ctx, next) {
        ctx.body = 'Hello Koa-next';
    });
    app.use(router.routes()).use(router.allowedMethods());
}

module.exports = register;