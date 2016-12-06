// ==UserScript==
// @name GoogleScraperContentScript
// @include https://www.google.com/search?*
// ==/UserScript==

kango.addMessageListener('ExecuteScrape', function(event) {
   var results = new Array;

   $('.vsc').each(function () {
      var a = $(this).find('.r').find('a');
      var url = a.attr('href');
      var title = a.html();
      var snippet = $(this).find('.st').html();
      results[results.length] = {url: url, title: title, snippet: snippet};
   });

   var b = new Blob([JSON.stringify(results)], {type: "text/plain;charset=utf-8"});

   saveAs(b, event.data);

   var next = $('#pnnext');

   if(next == null) {
      kango.dispatchMessage('AllQueryResultsScraped', true);
   }
   else {
      kango.dispatchMessage('ScrapeNewPage', next.attr('href'));
   }
});

