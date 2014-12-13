var
    _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    Path = require('path'),
    setting = require('../setting');

function Dir(path) {
    path = path.replace(/^([^\/])/g, '/$1').replace(/([^\/])$/, '$1/');

    this.offset = path.split('/').length;
    this.view = 'index';
    this.dir = {
        level: 1,
        path: path,
        title: path,
        dir: [],
        post: []
    };
}

Dir.MAX_LEVEL = 5;

_.extend(Dir.prototype, {

    read: function() {
        var defer = Q.defer();

        this.generate(this.dir);
        defer.resolve();

        return defer.promise;
    },

    toJSON: function() {
        return {
            dir: this.dir
        }
    },

    generate: function(dir) {
        var self = this;
        var prefix = dir.path;
        var path = '';

        dir.level = self.getLevel(prefix);
        dir.title = self.getDirTitle(dir.path) || dir.title;
        dir.dir = [];
        dir.post = [];

        if(self.needContinue(dir.level)) {

            var names = fs.readdirSync(Path.join(setting.docRoot, prefix));
            _.each(names, function(name) {
                // 过滤隐藏文件
                if(name.match(/^\./)) return;

                // 获取文件状态
                var stat = fs.statSync(Path.join(setting.docRoot, prefix, name));

                // 处理 Markdown 文件
                if(stat.isFile() && name.match(/\.md$/)) {
                    name = name.replace(/\.md$/, '');
                    path = prefix + name;
                    dir.post.push({
                        path: path,
                        title: self.getFileTitle(path) || name
                    });
                }

                // 处理目录
                if(stat.isDirectory()) {
                    var path = prefix + name + '/';
                    dir.dir.push({
                        path: path,
                        title: self.getDirTitle(path) || name
                    });
                }
            });

            _.each(dir.dir, function(_dir) {
                // 递归
                self.generate(_dir);
            });
        }
        return dir;
    },

    needContinue: function(level) {
        return (level + this.offset - 3) < Dir.MAX_LEVEL;
    },

    getLevel: function(path) {
        return path.split('/').length - this.offset + 1;
    },

    // 获取目录标题
    getDirTitle: function(path) {
        path = Path.join(setting.docRoot, path) + '.dir';
        if(fs.existsSync(path)) {
            var content = fs.readFileSync(path);
            var obj = JSON.parse(content);
            return obj.name;
        }
    },

    // 获取文件标题
    getFileTitle: function(path) {
        path = Path.join(setting.docRoot, path) + '.md';
        if(fs.existsSync(path)) {
            var content = fs.readFileSync(path).toString();
            var lines = content.split(/\n/);
            for(var i = 0, l = lines.length; i < l; i++) {
                var line = lines[i];

                if(!line) continue;
                return line.replace(/^[\s#]*|\s$/g, '')
            }
        }
    }

});

module.exports = Dir;
