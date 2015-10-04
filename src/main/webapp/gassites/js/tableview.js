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
     
	$.fn.TableView = function(objTemplate, callback){ // example ; $( "#contentTemplate" )


	  // debug flag. When its value is non-zero, debugging messages are displayed      

      var objData = null;
      var mainView = $(this);
      var pageData = null;
     
      var currentPage = 1;
      
      try
      {
         prefs = loadGadgetPrefs();
      }
	  catch(oError)
	  {
		  logerror(oError.description + ' ' + oError.type);
	  }
	  
	  /*
	   * toggle sort
	   */
	  $('#header_a').live("tap", function() { ascSort(this); });
	  $('#header_b').live("tap", function() { ascSort(this); });
	  $('#header_c').live("tap", function() { ascSort(this); });
	  $('#header_d').live("tap", function() { ascSort(this); });
	  
	  // currentPage
	  $('#previous').live("tap", function() { currentPage = ((currentPage - 1) <= 1) ? 1 : currentPage - 1; showPage(currentPage); });
	  $('#next').live("tap", function() { currentPage = ((currentPage + 1) > Math.ceil(pageData.data("totalpages"))) ? Math.ceil(pageData.data("totalpages"))  : currentPage + 1; showPage(currentPage); });
	  
	  
	  
	  /**
	   * sort descending
	   */
	  ascSort = function(oIcon)
	  {
		  if(typeof(oIcon) != 'undefined')
			  if(oIcon.id.indexOf("header")>=0)
			  {
				  var colname = "col_" + oIcon.id.split("_")[1];
				  logger('sorting : ' + colname + ' ' + $('#'+oIcon.id).attr('data-icon'));
				  $('ul#tableview>li').tsort('p#'+colname);
			  }
	  }
	  /*
	   * toggle sort
	   */
	  toggleSort = function(oIcon)
	  {
		  if(typeof(oIcon) != 'undefined')
			  if(oIcon.id.indexOf("header")>=0)
			  {
				   var colname = "col_" + oIcon.id.split("_")[1];
				   console.log($('#'+oIcon.id).attr('data-icon'));
				   var dataicon = $('#'+oIcon.id).attr('data-icon');
				  
				   var removeicon = 'ui-icon-' + dataicon;
				   var addicon = (dataicon == 'arrow-d') ? 'ui-icon-' + 'arrow-u' : 'ui-icon-' + 'arrow-d';
				   var dataicon = (dataicon == 'arrow-d') ? 'arrow-u' : 'arrow-d';
				   
				   $('#'+oIcon.id).attr('data-icon', dataicon);
				   $("#"+oIcon.id + " span.ui-icon").addClass(addicon).removeClass(removeicon);
				   if(dataicon == 'arrow-d')
					   $('ul#tableview>li').tsort('p#'+colname);
				   else
					   $('ul#tableview>li').tsort('p#'+colname,{order:'desc'});
			   }
	  }

	  
	  /*
	   * init
	   */  
	  init = function(DataContainer, onData, onError)
	  {
		  pageData = DataContainer;
		  getGoogleData(onData, onError);
		  return this;
	  };
	  
	  function getGoogleData(onData, onError)
	  {
		  logger("entering getGoogleData");
		 
		 
    	  try
    	  {
    	  
    	   	  var gs = new GoogleSpreadsheet();
		      gs.seturl(prefs['spreadsheetURL'], 'od4');
		      gs.seturl(gs.getWorksheetUrl());
		      gs.load(function(result) {
		    	 if(result != null)
	    		 {
		    		 for(index in result.data)
			      	 {
			      	 	var worksheet = result.data[index];
			      	 	
			      	 	if(worksheet.name.toLowerCase() == prefs['worksheetName'])
			      	 	{
			      	 		gs.seturl(worksheet.url);
				      	 	gs.load(function(wsresult)
				      	 	{
				      	 		if(wsresult != null)
			      	 			{
				      	 			try
					      	 		{
					      	 			logger("found data in google spreadsheet : " + gs.jsonUrl);
					      	 			googleData =  wsresult.getNamedDataRows();
					      	 			if ($.isFunction(onData)) onData.call();
						      	 	}
					      	 		catch(oError)
									{
										  logger(oError.description + ' ' + oError.type);
										  if ($.isFunction(onError)) onError.call(oError);
									}
			  
			      	 			}
				      	 		else
				      	 			logger("Unable to load worksheet data.");
				      	 		
				      	 		
				      	 	}); //end gs.load
			      	 	}
			      	 	
			      	 }
	    		 }else
	    			 logger("Problem loading worksheet");
		      	 
		      	 
		         
		      }); // end gs.load
		     
		      
		      
    	  }
    	  catch(oError)
    	  {
    		  logerror(oError.description + ' ' + oError.type);
    	  }
	  }
	  
	  
		  
	  /*
	   * process the content view in the dialog.
	   */
	  loadContent = function()
	  {
		  // setup current page
		  var maxitems = prefs.itemsPerPage;
		  
		  pageData.data(googleData[0]);
		  var totalpages = googleData[0].MaxRows / maxitems ;
		  logger("TOTAL PAGES : " + totalpages );
		  
		  pageData.data("maxitems", maxitems);
		  pageData.data("totalpages", totalpages);
		  
		  
		  processData(pageData);
		  objData = pageData;
		  
		  // process the template with the data, insert it into the content
		  $.tmpl(objTemplate, objData.data() ).appendTo( mainView ); 
		  
		  // refresh the dialog
		  mainView.listview('refresh');
	  };
	  
	  /*
	   * show li's for page
	   */
	  showPage = function(activepage)
	  {
		  if(pageData != null)
		  {
			  		  mainView.children().filter('li[id^="li"]').each(function()
					  {
			  			  try
			  			  {
			  				    var currentrow = Number($(this).attr('id').replace('li',''));
					  			var totalrows = pageData.data("MaxRows");
					  			var maxitems = pageData.data("maxitems");
					  			var bottomrow = (activepage - 1) * maxitems;
					  			if(bottomrow < 0 )
					  				bottomrow = 0;
					  			
					  			var toprow = bottomrow + maxitems;
					  			if(toprow > totalrows)
					  				toprow = totalrows;
					  			
					  			if((currentrow >= bottomrow) && (currentrow < toprow))
				  				{
				  				 // we are on the active page
					  				$(this).show();
				  				}
					  			else
				  				{
				  				 // we are not on the active page
					  				$(this).hide();
				  				}
			  			  }
			  			  catch(oError)
			  	    	  {
			  	    		  logerror(oError.description + ' ' + oError.type);
			  	    	  }
					  });
			  		// set page label
			  		// Page 1 of 10
			  		$('#pagenumber').html('<span class="ui-btn-inner"><span class="ui-btn-text">Page ' + activepage + ' of ' + Math.ceil(pageData.data("totalpages")) + '</span></span>');
			  
		  }
	  }
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
       * get http protocol to use
       */
      function getProtocol()
      {
    	  var httpPrefix = "";
    		 
    	  try
    	  {
        	 if(typeof(document.location.protocol) != 'undefined')
        	 		httpPrefix = document.location.protocol; 
    	  }catch(error)
          {
    	    	 try
    	    	 {
    		    	 if(typeof(parent.location.protocol) != 'undefined')
    			    	    	httpPrefix = parent.location.protocol; 
    	    	 }
    	    	 catch(error)
    	    	 {
    	    	 	httpPrefix = "";
    	    	 }
    	    	 
           }
    	 
    	 		
    	   httpPrefix = (httpPrefix.indexOf("http") < 0) ? "http:" : httpPrefix; // don't allow anything not expected to be set.
    	    
    	   return httpPrefix;
      }
      /*
      * logerror(msg)
      */
      function logerror(msg)
      {
          var cssErrorObj = {
			      'background-color' : '#FFBABA',
			      'background-image' : '../images/error_button_2.png',
			      'background-size'  : '60px 60px',
			      'color' : '#D8000C',
			      'border' : '1px solid',
			      'margin' : '10px 0px',
			      'padding': '15px 10px 15px 50px',
			      'background-color' : 'no-repeat',
			      'background-position' : '10px center',
			      'text-align' : 'left'
			    };
    
          msg = "Oops!  We had an error : <br>" + msg;
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
           var itemsPerPage = 5;
           
	       var qs = QueryString();
		   
		   if(!("spKey" in qs))
		   {
		   			//logerror("We need a spreadsheet key to access your list.  Please fix your options.");
		   			//return;
			   spreadsheetURL = getProtocol() + '//spreadsheets.google.com/pub?key=' +  spKey + '&hl=en&output=html' ;
		   }
		   else
			   spreadsheetURL = getProtocol() + '//spreadsheets.google.com/pub?key=' + qs["spKey"] + '&hl=en&output=html' ;
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
		    if("worksheetName" in qs)
		    	worksheetName = qs["worksheetName"].toLowerCase();
		    
		    if("itemsPerPage" in qs)
		    	itemsPerPage = Number(qs["itemsPerPage"]);
		   
		    if("debug" in qs)
		    	debug = qs["debug"].toLowerCase()  == "on" ? true : false;
      		
      		hash.push('spreadsheetURL');
  			hash['spreadsheetURL'] = spreadsheetURL;
  			
  			hash.push('worksheetName');
  			hash['worksheetName'] = worksheetName;
  			
  			hash.push('itemsPerPage');
  			hash['itemsPerPage'] = itemsPerPage;
  			
  			hash.push('debug');
  			hash['debug'] = debug;
  			
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
	    	  showPage: showPage
	    	  
		  });
      }
      else
      {
	      return{
	    	  init:init,
	    	  loadContent:loadContent,
	    	  showPage :showPage
	    	  
		  };
      }
	  
};

})(jQuery);