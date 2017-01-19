"use strict";
const fs = require('fs');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV || 'development';

function readConfig(dir, config) {
    config = config || {};
    let files = fs.readdirSync(dir);
    if (!files || !files.length) {
        return config;
    }
    files.forEach(function(name) {
        let filePath = path.join(__dirname, name);
        let file = fs.statSync(filePath);
        let moduleName = null;
        if (file.isDirectory()) {
            moduleName = path.join(filePath, NODE_ENV);
        } else {
            if (name !== 'index.js') {
                moduleName = path.join(filePath, name);
            }
        }
        if (moduleName) {
            if (require.cache[moduleName]) {
                require.cache[moduleName] = undefined;
            }
            if (require.cache[moduleName + '.js']) {
                require.cache[moduleName + '.js'] = undefined;
            }
            config[name] = require(moduleName);
        }
    });
    return config;
}

let configuration = readConfig('./');

function watchConfig(dir) {
    let files = fs.readdirSync(dir);
    if (!files || !files.length) {
        return;
    }
    watch(dir);
    files.forEach(function(name) {
        watch(path.join(__dirname, name));
    });

    function watch(path) {
        fs.watch(path, function(event, filename) {
            if (event == 'change') {
                setTimeout(function () {
                    configuration = readConfig('./');
                }, 3e3);
            }
        });
    }
}
watchConfig('./');

module.exports = configuration;