var md5 = require('MD5');

function gravatar(email) {
    return 'http://gravatar.duoshuo.com/avatar/' + md5(email);
}

module.exports = gravatar;
