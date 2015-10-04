/*
 * 	PayPal Donate Button
 *	written by xpandesiceng@yahoo.com
 *	http://gascripts.appspot.com/
 *
 *	Copyright (c) 2011 Raigosa.com Software Development Independent Contracting Services
 *	Dual licensed http://www.gnu.org/licenses/gpl.txt licenses.
 *
 *       jQuery 1.7.1
 *    
 *
 *  Description:
 *       Installation of said gadgets can be purchased as a service by contacting xpandesiceng@yahoo.com.
 *    
 *
 */

(function($) {

	$.fn.initDonate = function(){


	  // debug flag. When its value is non-zero, debugging messages are displayed      

      var debug = 1;
      var debug_html = '';
      // The string containing debugging messages
      var mainView = $(this);
      var prefs = null;
      try
      {
         prefs = loadGadgetPrefs();
         $('#paypalkey').val(prefs.paypalkey);
         logger("key set to : " + prefs.paypalkey);
      }
	  catch(oError)
	  {
		  logger(oError.description + ' ' + oError.type);
	  }
	  
	 
	  
    	 
    
     
     
      
   // Outputs debug messages if debug flag has a non-zero value
      function logger(msg) {      
        if (debug) {
          debug_html += msg + "<BR>";
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
           var paypalkey = 'ZHPEZHQLXU6R4'; // default feed
	      
	       var showerrors = true;
		   var qs = QueryString();
		   
		   if(!("paypalkey" in qs))
		   {
		   			logerror("We need a paypal key.  Please fix your options.");
		   			return;
		   }
		   
		    if("paypalkey" in qs)
		        paypalkey = qs['paypalkey'];
		
		   
		   	if("showerrors" in qs)
	  		   	showerrors = qs["showerrors"].toLowerCase() == "on" ? true : false;
		   	
		    if("debug" in qs)
		    	debug = qs["debug"].toLowerCase()  == "on" ? true : false;
      		
      		hash.push('paypalkey');
  			hash['paypalkey'] = paypalkey;
  			
  			hash.push('showerrors');
  			hash['showerrors'] = showerrors;
  			
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
	  
};

})(jQuery);
	  