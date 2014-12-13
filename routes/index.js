var
    express = require('express'),
    router = express.Router(),
    refresh = require('../helper/refresh');

var
    Page = require('../models/page'),
    Post = require('../models/post'),
    Diff = require('../models/diff'),
    Cache = require('../core/cache');

router.get('/', function(req, res) {
    renderPage('/', req, res);
});

router.get('/page(/*)?', function(req, res) {
    var path = req.params[1] || '/';

    renderPage(path, req, res);
});

router.get('/diff/:before_hash/:after_hash', function(req, res) {
    var before_hash = req.params.before_hash,
        after_hash = req.params.after_hash,
        key = 'diff/' + before_hash + '/' + after_hash;

    if(Cache.has(key)) {
        res.send(Cache.get(key));
        return;
    }

    var diff = new Diff(before_hash, after_hash);
    diff.read().then(function() {
        res.render('diff', diff.toJSON(), function(err, html) {
            send(err, html, key, res);
        });
    }).fail(function(msg) {
        res.render('error', {
            message: msg,
            err: {}
        });
    });
});

// for git hooks
router.post('/refresh', function(req, res) {
    refresh();
    res.send('ok');
});

router.get('/refresh', function(req, res) {
    Cache.clear();
    res.send('Cache clear');
});

function renderPage(path, req, res) {
    var page = null;

    if(Cache.has(path)) {
        res.send(Cache.get(path));
        return;
    }

    page = new Page(path);

    page.read().then(function() {
        res.render(page.view, page.toJSON(), function(err, html) {
            send(err, html, path, res);
        });
    }).fail(function(msg) {
        res.render('error', {
            message: msg,
            err: {}
        });
    });
}

function send(err, html, key, res) {
    if(err) {
        res.send('<pre>' + err.toString() + '</pre>');
    } else {
        Cache.set(key, html);
        res.send(html);
    }
}

module.exports = router;
