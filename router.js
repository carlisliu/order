"use strict";
import fs from 'fs';
import Router from 'koa-router';
const STATELESS_MIDDLEWARE = ['api'];

function register(app, option) {
    option = option || {};
    let rootRoute = option.root || './routes';
    let routes = fs.readdirSync(rootRoute);
    routes.map(function(route) {
        if (route) {
            route = route.replace(/^(\.+)/, '').replace(/(\.\w+)$/, '');
        }
        return route;
    }).filter(function(route) {
        if (route) {
            if (option.exclude) {
                return option.exclude.test(route);
            }
            return true;
        }
        return false;
    }).forEach(function(route) {
        let prefix = '/' + route;
        let router = require('./routes' + prefix);
        if (router instanceof Router) {
            router.prefix(prefix);
            if (!intercepted(prefix)) {
                //router.use(auth());
            }
            app.use(router.routes()).use(router.allowedMethods());
        }
    });

    let router = new Router();
    router.get('/', async function(ctx, next) {
        ctx.state = {
            title: 'koa2 title'
        };

        await ctx.render('index', {});
    });
    app.use(router.routes()).use(router.allowedMethods());

    function intercepted(path) {
        return path && STATELESS_MIDDLEWARE.indexOf(path) > -1;
    }
}

module.exports = register;