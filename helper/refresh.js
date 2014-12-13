var
    Q = require('q'),
    exec = Q.denodeify(require('child_process').exec);

function refresh() {
    var command = 'git pull origin master && git submodule foreach git pull origin master && pm2 restart ndoc';

    return exec(command)
        .then(function(std) {
            var stdout = std[0], stderr = std[1];
            console.log(stderr ? stderr : stdout);
        }).fail(function(error) {
            console.log(error);
        });
}

module.exports = refresh;
