const Koa = require('koa');
const serve = require('koa-static');
const favicon = require('koa-favicon');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const router = require('./router');
const convert = require('koa-convert');

const app = new Koa();

app.use(convert(favicon(__dirname + '/public/favicon.ico')));

// etag works together with conditional-get
app.use(convert(conditional()));
app.use(convert(etag()));

// or use absolute paths
app.use(convert(serve(__dirname + '/public')));

router(app);

app.on('error', function (error, cxt) {
    console.error(error);
});

module.exports = app;