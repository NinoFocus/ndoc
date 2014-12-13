$(function() {
    // bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // highlight
    hljs.initHighlightingOnLoad();
});

// disqus
$(function() {
    // 先下线
    return;

    if(!$('#disqus_thread').size()) return;

    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    disqus_shortname = 'youzandoc'; // required: replace example with your forum shortname

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
       var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
       dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
       (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
});

// 百度统计
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?ee13a229c3dd48f532222528ab4786f1";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
