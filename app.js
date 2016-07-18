var Koa = require('koa');
var serve = require('koa-static');
var favicon = require('koa-favicon');
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');

var app = new Koa();

app.use(favicon(__dirname + '/public/favicon.ico'));

// etag works together with conditional-get
app.use(conditional());
app.use(etag());

// or use absolute paths
app.use(serve(__dirname + '/public'));

module.exports = app;