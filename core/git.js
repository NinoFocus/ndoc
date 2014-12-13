var
    _ = require('underscore'),
    Q = require('q'),
    gravatar = require('../helper/gravatar'),
    exec = Q.denodeify(require('child_process').exec),
    docRoot = require('../setting').docRoot,
    SEP = '#=#-#-#=#';

var Git = {

    log: function(filepath) {
        var defer = Q.defer();
        var command = 'cd ' + docRoot + ' && git --no-pager log \
                        --pretty=format:"%h' + SEP + '%an' + SEP + '%ae' + SEP + '%ad' + SEP + '%s" \
                        --no-merges \
                        --follow \
                        --raw \
                        --no-renames \
                        --date=relative \
                        -- ' + filepath;

        exec(command).then(function(std) {
            var stdout = std[0], stderr = std[1];

            stderr ? defer.resolve({}) : defer.resolve(processLogs(stdout));
        }).fail(function(err) {
            defer.reject(err);
        });

        return defer.promise;
    },

    show: function(hash) {
        var defer = Q.defer();

        var command = 'git --no-pager show ' + hash;

        if(!hash.match(/^0*$/)) {
            exec(command).then(function(std) {
                var stdout = std[0], stderr = std[1];

                stderr ? defer.reject(stderr) : defer.resolve(stdout);
            }).fail(function(err) {
                defer.reject(err);
            });
        } else {
            defer.resolve('');
        }

        return defer.promise;
    }

}

function processLogs(logs) {
    var info = {
        authors: [],
        logs: []
    };

    if(!logs) return info;

    logs = logs.split(/\n/);


    for(var i = 0, lenght = logs.length; i < lenght; i = i + 3) {
        var log = logs[i],
            hash = logs[i + 1],
            commit = {};

        log = log.split(SEP);
        hash = hash.split(' ');

        commit = {
            id: log[0],
            name: log[1],
            email: log[2],
            avatar: gravatar(log[2]),
            date: log[3],
            message: log[4],
            before_hash: hash[2].replace(/\./g, ''),
            after_hash: hash[3].replace(/\./g, '')
        };

        info.logs.push(commit);

        var find = function(author) {
            return author.email.toLowerCase() === commit.email.toLowerCase()
                || author.name.toLowerCase() === commit.name.toLowerCase();
        };

        if(!_.find(info.authors, find)) {
            info.authors.push(commit);
        }
    }

    return info;
}

module.exports = Git;
