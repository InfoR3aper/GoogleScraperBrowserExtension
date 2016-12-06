$(function() {
   $('#datepicker').datepicker();

   $('#scrape').click(function(){
      kango.browser.tabs.getCurrent(function(tab) {
         var origParams = URI(tab.getUrl()).search(true);
         var newUrl = new URI('https://www.google.com/search')
            .addSearch('filter', 0)
            .addSearch('q', origParams['q'])
            .addSearch('start', 0)
            .addSearch('num', 100);

         kango.dispatchMessage('ScrapeNewPage', newUrl.toString());
      });
   });
});
