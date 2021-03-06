import chokidar from 'chokidar';
import requireReload from 'require-reload';
import _debugger from 'debug';

let reload = requireReload(require);
let debug = _debugger('order:config');

debug('configuration');

let watcher = chokidar.watch(`${__dirname}`, {
    ignored: /index\.js$/,
    persistent: true
});

let log = console.log.bind(console);

watcher.on('add', function(path) {
    log('File', path, 'has been added');
}).on('addDir', function(path) {
    log('Directory', path, 'has been added');
}).on('change', function(path) {
    log('File', path, 'has been changed');
}).on('unlink', function(path) {
    log('File', path, 'has been removed');
}).on('unlinkDir', function(path) {
    log('Directory', path, 'has been removed');
}).on('error', function(error) {
    log('Error happened', error);
}).on('ready', function() {
    log('Initial scan complete. Ready for changes.');
}).on('raw', function(event, path, details) {
    log('Raw event info:', event, path, details);
});

export default {};