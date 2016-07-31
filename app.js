import Koa from 'koa';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import favicon from 'koa-favicon';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import router from './router';
import convert from 'koa-convert';
import views from 'koa-views';
import logger from 'koa-logger';
import json from 'koa-json';
import config from './config';
import ioredis from 'ioredis';

const app = new Koa();
app.use(logger());
app.use(bodyParser());
app.use(json());
app.use(favicon(__dirname + '/public/favicon.ico'));

app.keys = ['order', 'delivery'];
app.use(convert(session({
    store: redisStore({
        client: ioredis.createClient()
    })
})));

// etag works together with conditional-get
app.use(conditional());
app.use(etag());

// or use absolute paths
app.use(serve(__dirname + '/public'));

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

router(app);

app.on('error', function(error, cxt) {
    console.error(error);
});

module.exports = app;