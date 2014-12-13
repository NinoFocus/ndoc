var
    _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    readFile = Q.denodeify(fs.readFile),
    setting = require('../setting'),
    Git = require('../core/git'),
    jsdiff = require('diff');


function Diff(before_hash, after_hash) {
    this.before_hash = before_hash;
    this.after_hash = after_hash;
    this.content = '';
}

_.extend(Diff.prototype, {

    read: function() {
        var diff = this;

        var beforeDefer = Git.show(this.before_hash).then(function(data) {
            diff.before_content = data;
        });

        var afterDefer = Git.show(this.after_hash).then(function(data) {
            diff.after_content = data;
        });

        return Q.all([beforeDefer, afterDefer]).then(function() {
            var d = jsdiff.diffLines(diff.before_content, diff.after_content);
            var content = [];

            d.forEach(function(part) {
                var color = part.added ? 'diff-addition' : part.removed ? 'diff-deletion' : 'diff-unchange';
                content.push('<div class="' + color + '">' + _.escape(part.value) + '</div>');
            });

            diff.content = content.join('');
        });
    },

    toJSON: function() {
        return {
            content: this.content
        };
    }

});

module.exports = Diff;
