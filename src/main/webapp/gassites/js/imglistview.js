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

	$.fn.loadImgListView = function(){


	  // debug flag. When its value is non-zero, debugging messages are displayed      

      var debug = 1;
      // The string containing debugging messages
      var debug_html = "";
      var mainView = $(this);
      var prefs = null;
      try
      {
         prefs = loadGadgetPrefs();
      }
	  catch(oError)
	  {
		  logger(oError.description + ' ' + oError.type);
	  }
	  
	 
	  

      // Setup the view.
     
    	  logger("entering main function");
    	  try
    	  {
    	  
    	  
    	  
    	   	  var gs = new GoogleSpreadsheet();
		      gs.seturl(prefs['listViewURL'], 'od4');
		      gs.seturl(gs.getWorksheetUrl());
		      gs.load(function(result) {
		      	 for(index in result.data)
		      	 {
		      	 	var worksheet = result.data[index];
		      	 	if(worksheet.name.toLowerCase() == 'dashboard')
		      	 	{
		      	 	   gs.seturl(worksheet.url);
		      	 	   gs.load(function(dsresult)
			      	   {
			      	        try
			      	 	    {
				      	        var headerhtml = dsresult.getValue(6,7);
				      	        $('#header').html(headerhtml);
				      	        
				      	        var footerhtml = dsresult.getValue(14,7);
				      	        $('#footer').html(footerhtml);
				      	        
				      	        if (!prefs['showheader'])
				      	        {
				      	             $('#header').hide();
				      	        } 
				      	        if (!prefs['showfooter'])
				      	        {
				      	             $('#footer').hide();
				      	        } 
				      	        mainView.listview('refresh');
				      	    }
			      	 		catch(oError)
							{
								  logger(oError.description + ' ' + oError.type);
							}   
			      	   });
		      	 	}
		      	 	if(worksheet.name.toLowerCase() == 'list')
		      	 	{
		      	 		gs.seturl(worksheet.url);
			      	 	gs.load(function(wsresult)
			      	 	{
			      	 		try
			      	 		{
				      	 		var totalrows = wsresult.getTotalRows();
				      	 		var totalcols = wsresult.getTotalColumns();
				      	 		var maxrows = Number(prefs['maxitems']) + 1;
				      	 		maxrows = (maxrows <= totalrows) ? maxrows : totalrows;
				      	 		for(var r=2; r <= maxrows; r++)
				      	 		{
				      	 		    var imagelink = wsresult.getValue(r, 1);
				      	 		    var link = wsresult.getValue(r, 2);
				      	 		    var header = wsresult.getValue(r, 3);
				      	 		    var body = wsresult.getValue(r, 4);
				      	 			
				      	 			$(createListElement(link, 
	    		  							imagelink,
	    		  							header, 
	    		  							body
	    		  							)).appendTo(mainView);
	    		  					
				      	 			
				      	 		}
				      	 		mainView.listview('refresh');
				      	 	}
			      	 		catch(oError)
							{
								  logger(oError.description + ' ' + oError.type);
							}
	  
			      	 		
			      	 	});
		      	 	}
		      	 	
		      	 }
		      	 
		         
		      });
    	  
    	  /*
    	 
    	      $(createListElement('http://actionscreenprinting.com/', 
    		  							'https://sites.google.com/site/thekyronhormanfoundation/config/pagetemplates/khf-main/howyoucanhelp2.jpg',
    		  							'Company1', 
    		  							'Helping children and their famallies'
    		  							)).appendTo(mainView);
    		  $(createListElement('http://actionscreenprinting.com/', 
    		  							'https://sites.google.com/site/thekyronhormanfoundation/config/pagetemplates/khf-main/howyoucanhelp2.jpg',
    		  							'Company2', 
    		  							'2Helping children and their famallies'
    		  							)).appendTo(mainView);
    		  							
    		  
    		 */
    		  
    		  
    		  
    		 
    	  }catch(oError)
    	  {
    		  logger(oError.description);
    	  }
    	 
      /**
      * create image list element
      		<li data-icon="false">
				<a target="_top" href="http://actionscreenprinting.com/">
								<img border="0" src="https://sites.google.com/site/thekyronhormanfoundation/_/rsrc/1326089278080/home/howyoucanhelp2.jpg">
								<h3>Test Company</h3>
								<p>
									On June 4th 2010 a 7 year old boy by the name of Kyron Horman was abducted from his Portland, Oregon based elementary school. In the resulting efforts to locate him his parents launched a massive search and public awareness campaign. In July 2010 and during this effort Kyron’s father, Kaine Horman founded a
								</p>	
				</a>
			</li>
      
      */
      function createListElement(url, imageurl, header, text)
      {
      
					   
      var elementStr = '<li data-icon="false" data-theme="d" class="ui-btn ui-btn-icon-left ui-li ui-li-has-thumb ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text">' +
				'<a target="_top" href="' + url + '" class="ui-link-inherit">' +
				'<img border="0" src="' + imageurl + '" class="ui-li-thumb">' +
				//'<h5 class="ui-li-heading">'+ header +'</h3>' +
				'<p ><strong>'+ header +'</strong></p>' +
				'<p class="ui-li-desc">' + text +'</p>' +
				'</a>' +
			    '</div></div></li>';
	//	elementStr = 	'<li data-icon="false">' +
	//							' <a target="_top" href="' + url      + '">'    +
	//							'	<div style="float:left;width:40px;margin:3px;text-align:center;"><center><img border="0" src="' + imageurl + '" class="ui-li-icon"></center></div>'    +
	//							'<div style="float:left;margin:3px;"><p><strong>' + header   + '</strong></p>' +
	//							'				     <p>'  + text  +'</p> </div>' +	
								//'<p><strong>' + header   + '</strong></p>' +
								//'				     <p>'  + text  +'</p> ' +	
	//							'</a></li> ' ;
					  
       elementStr = 	'<li data-icon="false"><a target="_top" href="' + url + '">'+
                            '<img  src="' + imageurl + '" class="ui-li-icon">' +
							'	<p style="margin-left:15px;"><strong>' + header + '</strong></p>'+
							'	<p style="margin-left:15px;font-size:9px;white-space:normal;">' + text + '</p>'+
							'</a></li>' ;
							
						//	'	<p class="ui-li-aside" ><strong>4:48</strong>PM</p>'+
							
      	return $(elementStr);
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
           var listViewURL = 'https://spreadsheets.google.com/pub?key=t8IQPRWNHlA4jvJQe5ezi9g&hl=en&output=html'; // default feed
	       var maxitems = 2;
	       var showheader = true;
	       var showfooter = true;
	       var showerrors = true;
		   var qs = QueryString();
		   
		   if(!("spkey" in qs))
		   {
		   			logerror("We need a spreadsheet key to access your list.  Please fix your options.");
		   			return;
		   }
		   else
		   		listViewURL = 'https://spreadsheets.google.com/pub?key=' + qs["spkey"] + '&hl=en&output=html' ;
		   	
		    if("maxitems" in qs)
		        maxitems = Number(qs['maxitems']);
		
			if("showheader" in qs)
	  		   	showheader = qs["showheader"].toLowerCase() == "on" ? true : false;
	  		
	  		if("showfooter" in qs)
	  		   	showfooter = qs["showfooter"].toLowerCase() == "on" ? true : false;
	  		   		
		   	if("showerrors" in qs)
	  		   	showerrors = qs["showerrors"].toLowerCase() == "on" ? true : false;
		   	
		    if("debug" in qs)
		    	debug = qs["debug"].toLowerCase()  == "on" ? true : false;
      		
      		hash.push('listViewURL');
  			hash['listViewURL'] = listViewURL;
  			
  			hash.push('maxitems');
  			hash['maxitems'] = maxitems;
  			
  			hash.push('showheader');
  			hash['showheader'] = showheader;
  			
  			hash.push('showfooter');
  			hash['showfooter'] = showfooter;
  			
  			hash.push('showerrors');
  			hash['showerrors'] = showerrors;
  			
  			hash.push('debug');
  			hash['debug'] = debug;
  			
  			return hash;
      }
      /*
      * set additional look and feel arguments
      */
      function setLookFeel(prefs)
      {
      
      	$('li.bannerbody').each(function(){
      				if(prefs.bannerWidth != null)
      					$(this).width( prefs.bannerWidth );
      				if(prefs.bannerHeight != null)
      					$(this).height(prefs.bannerHeight);
      				if(prefs.bannerBackGroundColor != null)
      					$(this).css( 'background-color' , prefs.bannerBackGroundColor );
      				
      	}
      	);
      	$('li.bannerbody').find('table').each(function(){
	         if(prefs.bannerFontSize != null)
	      					$(this).css( 'font-size' , prefs.bannerFontSize);
         });
		
		
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
	  
};

})(jQuery);
	  