// better performance.
global.Promise = require('bluebird');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const favicon = require('koa-favicon');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const router = require('./router');
const convert = require('koa-convert');
const views = require('koa-views');
const logger = require('koa-logger');

const app = new Koa();
app.use(logger());
app.use(bodyParser());
app.use(favicon(__dirname + '/public/favicon.ico'));

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