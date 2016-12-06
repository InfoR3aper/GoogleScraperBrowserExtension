// Not yet implemented:
// Go back one week at a time the first year and then one month at a time the next 9 years and then one year at a time

function GoogleScraper() {
	var self = this;

   kango.ui.browserButton.setPopup({
      url: 'popup.html',
      width: 400,
      height: 400
   });

   var currentTabId = -1;

   kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, function (eventDetails){
      if(eventDetails.target.getId() == currentTabId) {
         var filename = CreateFilenameFromUrlParams(URI(eventDetails.target.getUrl()).search(true));
         setTimeout(function(){
            eventDetails.target.dispatchMessage('ExecuteScrape', filename);
         }, Math.floor((Math.random()*3)+1000));
      }
   });

   kango.addMessageListener('ScrapeNewPage', function(event) {
      var origNextParams = URI('https://www.google.com' + event.data).search(true);
      var newNextUrl = new URI('https://www.google.com/search')
         .addSearch('filter', 0)
         .addSearch('q', origNextParams['q'])
         .addSearch('start', origNextParams['start'])
         .addSearch('num', 100);

      kango.browser.tabs.getCurrent(function(tab) {
         currentTabId = tab.getId();
         tab.navigate(newNextUrl.toString());
      });
   });

   kango.addMessageListener('AllQueryResultsScraped', function(event) {
      currentTabId = -1;
      console.log("Finished with this query's results");
   });
}

function CreateFilenameFromUrlParams(params) {
   var q = params['q'].replace(/[\/:*?<>|]/g, "").replace(/["]/g, "'");
   var start = params['start'];
   if(start == "") {
      start = '0';
   }
   var dateRange = decodeURIComponent(params['tbs']);
   var found = /cd_min:(\d+\/\d+\/\d+)/.exec(dateRange);
   var dateMin = "";
   if(found != null && found[1] != null) {
      dateMin = found[1].replace(/[/]/g, '-');
   }

   var found = /cd_max:(\d+\/\d+\/\d+)/.exec(dateRange);
   var dateMax = "";
   if(found != null && found[1] != null) {
      dateMax = found[1].replace(/[/]/g, '-');
   }

   return q + ',' + start + ',' + dateMin + 'to' + dateMax + ".sr";
}

var extension = new GoogleScraper();