$(function() {
    // highlight
    hljs.initHighlightingOnLoad();
});

$(function() {
    if($('.ds-thread').length === 0) return;

    window.duoshuoQuery = {short_name:"ninotips"};
    (function() {
        var ds = document.createElement('script');
        ds.type = 'text/javascript';ds.async = true;
        ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.unstable.js';
        ds.charset = 'UTF-8';
        (document.getElementsByTagName('head')[0]
         || document.getElementsByTagName('body')[0]).appendChild(ds);
    })();
})
