var
    _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    markdown = require('../helper/markdown'),
    readFile = Q.denodeify(fs.readFile),
    setting = require('../setting'),
    Git = require('../core/git');

function Post(filepath) {
    this.view = 'post';
    // 文档相对路径
    this.filepath = filepath;
    // 文档标题
    this.title = '';
    // 文档内容
    this.content = '';
    // 文档作者
    this.authors = null;
    // 文档修改历史
    this.logs = null;
}

_.extend(Post.prototype, {

    read: function() {
        var post = this, defer = [];

        // 读取文档内容，并解析Markdown
        defer[0] = readFile(this.getAbsoluteFilepath()).then(function(data) {
            var content = data.toString();
            post.title = post.getTitle(content);
            post.content = markdown(content);
        });

        // 读取文档作者、修改历史等信息
        defer[1] = Git.log(this.getAbsoluteFilepath()).then(function(data) {
            post.authors = data.authors;
            post.logs = data.logs;
        });

        return Q.all(defer);
    },

    toJSON: function() {
        return {
            title: this.title,
            content: this.content,
            authors: this.authors,
            logs: this.logs,
            filepath: this.filepath
        };
    },

    getAbsoluteFilepath: function() {
        return path.join(setting.docRoot, this.filepath);
    },

    getTitle: function(content) {
        var lines = content.split(/\n/);
        for(var i = 0, l = lines.length; i < l; i++) {
            var line = lines[i];

            if(!line) continue;
            return line.replace(/^[\s#]*|\s$/g, '')
        }
    }

});

module.exports = Post;
