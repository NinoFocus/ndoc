var
    _ = require('underscore'),
    fs = require('fs'),
    Path = require('path'),
    setting = require('../setting');

var
    Post = require('./post'),
    Dir = require('./dir');

function Page(path) {
    var dirpath = Path.join(setting.docRoot, path);
    var filepath = dirpath + '.md';
    var stat = null;

    try {
        stat = fs.statSync(filepath);
        if(stat.isFile()) {
            return new Post(path + '.md');
        }
    } catch(err) {}

    try {
        stat = fs.statSync(dirpath);
        if(stat.isDirectory()) {
            return new Dir(path);
        }
    } catch(err) {}

    throw new Error(path + ' 未找到');
}

module.exports = Page;
