/*
 * 	Image List View, show a small list from google List teamplate.
 *	written by xpandesiceng@yahoo.com
 *	http://gascripts.appspot.com/
 *
 *	Copyright (c) 2011 Raigosa.com Software Development Independent Contracting Services
 *	Dual licensed under the http://jquery-ui.googlecode.com/svn/tags/latest/MIT-LICENSE.txt
 *	and http://www.gnu.org/licenses/gpl.txt licenses.
 *
 *       jQuery 1.7.1 and jQueryMobile
 *
 *
 *  Description:
 *       Installation of said gadgets can be purchased as a service by contacting xpandesiceng@yahoo.com.
 *
 *
 */

(function($) {
	 var debug = 1;
     // The string containing debugging messages
     var debug_html = "";
     var prefs = null;

  // get the data
	 var data = [{
		  List: "{ &#34;City&#34; : [ &#34;Sacramento&#34;, &#34;Atlanta&#34;, &#34;Greenville&#34; ], &#34;State&#34; : [ &#34;California&#34;, &#34;Georgia&#34;, &#34;South Carolina&#34; ] }",
		  totalrows: "3"
		  }];
	 var googleData = null;
	 var header = null;
	 var footer = null;

	$.fn.TableView = function(objTemplate, callback){ // example ; $( "#contentTemplate" )


	  // debug flag. When its value is non-zero, debugging messages are displayed

      var objData = null;
      var mainView = $(this);
      var pageData = null;

      try
      {
         prefs = loadGadgetPrefs();
      }
	  catch(oError)
	  {
		  logerror(oError.description + ' ' + oError.type);
	  }


	  /*
	   * init
	   */
	  init = function(DataContainer, onData, onFooterHeader, onError)
	  {
		  pageData = DataContainer;
		  getGoogleData(onData, onFooterHeader, onError);
		  return this;
	  };

	  function getGoogleData(onData, onFooterHeader, onError)
	  {
		  logger("entering getGoogleData");


	  try
	  {
    	  // dashboard data

    	      var gsdash = new GoogleSpreadsheet();
		      gsdash.seturl(prefs['spreadsheetURL'], 'od4');
		      gsdash.seturl(gsdash.getWorksheetUrl());
		      gsdash.load(function(result) {
				      	  for(index in result.data)
				      	  {
					      	   var worksheet = result.data[index];
					      	 	if(worksheet.name.toLowerCase() == 'dashboard')
					      	 	{

							      	logger('trying to get dashboard data');

							      	gsdash.seturl(worksheet.url);
						      	 	gsdash.load(function(wsresult)
						      	 	{
						      	 		try
						      	 		{
						      	 		    logger('found dashboard sheet');
						      	 		    header = wsresult.getValue(6,7);
						      	 		    footer = wsresult.getValue(14,7);
						      	 			logger("found data in google spreadsheet, dashboard");
						      	 			if ($.isFunction(onFooterHeader)) onFooterHeader.call();
							      	 	}
						      	 		catch(oError)
										{
											  logger(oError.description + ' ' + oError.type);

										}


						      	 	}); //end gsdash.load
					      	 	}
					      	 }

		  		 }); // end gsdash.load


    	  // main body data
    	   	  var gs = new GoogleSpreadsheet();
		      gs.seturl(prefs['spreadsheetURL'], 'od4');
		      gs.seturl(gs.getWorksheetUrl());
		      gs.load(function(result) {
		      	 for(index in result.data)
		      	 {
		      	    var worksheet = result.data[index];
		      	 	if(worksheet.name.toLowerCase() == prefs['worksheetName'])
		      	 	{
		      	 		gs.seturl(worksheet.url);
			      	 	gs.load(function(wsresult)
			      	 	{
			      	 		try
			      	 		{
			      	 			logger("found data in google spreadsheet");
			      	 			googleData =  wsresult.getNamedDataRows(prefs['maxitems'], prefs['addrows']);
			      	 			if ($.isFunction(onData)) onData.call();
				      	 	}
			      	 		catch(oError)
							{
								  logger(oError.description + ' ' + oError.type);
								  if ($.isFunction(onError)) onError.call(oError);
							}


			      	 	}); //end gs.load
		      	 	}

		      	 }


		      }); // end gs.load







    	  }
    	  catch(oError)
    	  {
    		  logerror(oError.description + ' ' + oError.type);
    	  }
	  }

	  /*
	  * set the footer and header
	  */
	  setFooterHeader = function()
	  {
			if(prefs['showheader'])
				$('#header').html(header);

			if(prefs['showfooter'])
				$('#footer').html(footer);

	  }

	  /*
	   * process the content view in the dialog.
	   */
	  loadContent = function()
	  {
		  pageData.data(googleData[0]);

		  processData(pageData);
		  objData = pageData;

		  // process the template with the data, insert it into the content
		  $.tmpl(objTemplate, objData.data() ).appendTo( mainView );

		  // refresh the dialog
		  mainView.listview('refresh');
	  };
	  /*
	   * processData
	   */
	  function processData(dataObj)
	  {
		  try
		  {

				jQuery.each(dataObj.data(),function(property,value)
				{
					/*  need to have a way to detect json data in the values
					if(property == "List")
					{
						dataObj = parseJsonData(value, dataObj);
					}
					*/

					if(/\s/g.test(property))
					{
						property = property.replace(/\s+/g, "_");
						dataObj.data(property, value); // adds a new property with _ instead of space.
					}

				});
				// show whats in the data object
				var msg = '';
				jQuery.each(dataObj.data(),function(property,value)
				{
					msg = msg + '\n' + property + " : " + value + "<br>";
				});
				logger(msg);
		  }
		  catch(oError)
		  {
			  logerror("<b>ERROR : </b><font color=red>" + oError.message + "</font>");
		  }
	  }

      function parseJsonData(value, oData)
      {
    	  logger("parsing production options");
    	  var jsonText = htmlDecode(value);
    	  var objJson = jQuery.parseJSON(jsonText);
    	  $.each(objJson, function(property , propvalue)
    	  {
    		  	  oData.data(property,propvalue);
    			  logger("processing  : " + property);

    	  }
    	  );

    	  logger(jsonText);
    	  return oData;
      }


	  /*
	   * html decode
	   */
      function htmlEncode(value)
      {
    	 // return $('<span>' + value + '</span>').html();
    	  return escape(value);
      }

      function htmlDecode(value)
      {
    	  return $("<span/>").html(value).text();

      }

   // Outputs debug messages if debug flag has a non-zero value
      function logger(msg) {
        if (debug) {
          debug_html += msg + "<BR>";
          // Write debug HTML to div
          //$("#debug").innerHTML = debug_html;
          $("div#debug").empty();
          $("div#debug").append(debug_html);
        }
      }



      /*
      * logerror(msg)
      */
      function logerror(msg)
      {
          var cssErrorObj = {
			      'background-color' : '#FFBABA',
			      'background-image' : 'http://www.wpclipart.com/computer/icons/other_icons/error_button_2.png',
			      'background-size'  : '60px 60px',
			      'color' : '#D8000C',
			      'border' : '1px solid',
			      'margin' : '10px 0px',
			      'padding': '15px 10px 15px 50px',
			      'background-color' : 'no-repeat',
			      'background-position' : '10px center',
			      'text-align' : 'left'
			    };

          msg = "Opps!  We had an error : <br>" + msg;
          $("div#error").css(cssErrorObj);
          $("div#error").append(msg);
      }
      /*
      *  load the gadget prefrences
      */
      function loadGadgetPrefs()
      {
           var hash = [];
           var prefs = null;
           var spKey = 't8IQPRWNHlA4jvJQe5ezi9g'; // default feed
           var worksheetName = "list";
	       var qs = QueryString();
	       var showfooter = true;
	       var showheader = false;
	       var maxitems = 5;
	       var addrows = 0;

		   if(!("spKey" in qs))
		   {
		   			//logerror("We need a spreadsheet key to access your list.  Please fix your options.");
		   			//return;
			   spreadsheetURL = 'https://spreadsheets.google.com/pub?key=' +  spKey + '&hl=en&output=html' ;
		   }
		   else
			   spreadsheetURL = 'https://spreadsheets.google.com/pub?key=' + qs["spKey"] + '&hl=en&output=html' ;
		   	/*
		    if("maxitems" in qs)
		        maxitems = Number(qs['maxitems']);

			if("showheader" in qs)
	  		   	showheader = qs["showheader"].toLowerCase() == "on" ? true : false;

	  		if("showfooter" in qs)
	  		   	showfooter = qs["showfooter"].toLowerCase() == "on" ? true : false;

		   	if("showerrors" in qs)
	  		   	showerrors = qs["showerrors"].toLowerCase() == "on" ? true : false;
		   	*/
		   	if("maxitems" in qs)
		        maxitems = Number(qs['maxitems']);

		    if("addrows" in qs)
		        addrows = Number(qs['addrows']);

		   	if("showheader" in qs)
	  		   	showheader = qs["showheader"].toLowerCase() == "on" ? true : false;

	  		if("showfooter" in qs)
	  		   	showfooter = qs["showfooter"].toLowerCase() == "on" ? true : false;

		    if("worksheetName" in qs)
		    	worksheetName = qs["worksheetName"].toLowerCase();

		    if("debug" in qs)
		    	debug = qs["debug"].toLowerCase()  == "on" ? true : false;

      		maxitems++;
      		hash.push('maxitems');
  			hash['maxitems'] = maxitems;

  			hash.push('addrows');
  			hash['addrows'] = addrows;

      		hash.push('spreadsheetURL');
  			hash['spreadsheetURL'] = spreadsheetURL;

  			hash.push('worksheetName');
  			hash['worksheetName'] = worksheetName;

  			hash.push('debug');
  			hash['debug'] = debug;

  			hash.push('showheader');
  			hash['showheader'] = showheader;

  			hash.push('showfooter');
  			hash['showfooter'] = showfooter;

  			return hash;
      }

      /*
      * query string parsing
      */
      function QueryString() {
        var a = window.location.search.substr(1).split('&');
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
       }

      if ($.isFunction(callback))
      {
	      callback.call({
	    	  init:init,
	    	  loadContent:loadContent,
	    	  setFooterHeader: setFooterHeader

		  });
      }
      else
      {
	      return{
	    	  init:init,
	    	  loadContent:loadContent,
	    	  setFooterHeader:setFooterHeader

		  };
      }

};

})(jQuery);
