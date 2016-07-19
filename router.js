"use strict";
const fs = require('fs');
const Router = require('koa-router');

function register(app) {
    let routes = fs.readdirSync('./routes');

    routes.map(function(route) {
        if (route) {
            route = route.replace(/^(\.+)/, '').replace(/(\.\w+)$/, '');
        }
        return route;
    }).filter(function(route) {
        return !!route;
    }).forEach(function(route) {
        let prefix = '/' + route;
        let router = require('./routes' + prefix);
        router.prefix(prefix);
        app.use(router.routes()).use(router.allowedMethods());
    });

    let router = new Router();
    router.get('/', function(ctx, next) {
        ctx.body = 'Hello Koa-next';
    });
    app.use(router.routes()).use(router.allowedMethods());
}

module.exports = register;