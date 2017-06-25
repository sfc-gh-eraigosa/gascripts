/*
 * 	Announcements Rotating Banners
 *	written by xpandesiceng@yahoo.com
 *	https://sites.google.com/site/xpandesiceng/home/arbanner
 *
 *	Copyright (c) 2011 Raigosa.com Software Development Independent Contracting Services
 *	Dual licensed under the http://jquery-ui.googlecode.com/svn/tags/latest/MIT-LICENSE.txt
 *	and http://www.gnu.org/licenses/gpl.txt licenses.
 *
 *	Built using jQuery utilizing Easy Slider 1.7 http://cssglobe.com,
 *       jquery.zRSSFeed 1.4.4 by Zazar Ltd, (http://www.zazar.net/developers/jquery/zrssfeed/)
 *       jQuery 1.7.1
 *
 *
 *  Description:
 *       arbanner reads from rss feed and displays feeds in rotating banner provided by easy slider.
 *       arbanner embeds this in google gadgets technology to provide sites developers access to add to their site.
 *       View demo here: https://sites.google.com/site/xpandesiceng/home/arbanner
 *       Installation of said gadgets can be purchased as a service by contacting xpandesiceng@yahoo.com.
 *
 *
 */

(function($) {

    var global_options = {
    	   feedURL               : 'https://sites.google.com/site/raigosafamily/testbanners/posts.xml',
		   bannerSpeed           : 800,
		   bannerPause           : 6000,
		   bannerLOffset         : 0,
		   feedPerBanner         : 3,
		   feedLimit             : "10",
		   bannerHeight          : null,
		   bannerWidth           : null,
		   bannerBackGroundColor : null,
		   bannerFontSize        : null,
		   showerrors            : true
	  };


	$.fn.loadBanners = function(options){


// debug flag. When its value is non-zero, debugging messages are displayed
      global_options = options || global_options;
      var debug = 0;
      // The string containing debugging messages
      var debug_html = "";
      var sliderobj = $(this);

      var prefs = loadGadgetPrefs();



      // Load banners from the anouncements page

    	  logger("entering main function to load banners");
    	  try
    	  {


    		  $(this).after("<div id='thefeed'></div>");
    		  $('#thefeed').hide();
    		  /*
    		  $('#thefeed').rssfeed(prefs.feedURL, {
    			    limit: 5
    			  });
    		  */
    		  $('#thefeed').rssfeed(prefs.feedURL,{
    		  	   snippet: false,
    		  	   contenttag: 'arbannerfeeds',
    		  	   limit: prefs.feedLimit,
    		  	   linktarget: "_top"
	    		  }, function(e) {
	    		       if($(e).find('.rssError').text() == "")
	    		       {
		    				processBody($(e).find('div.rssBody'),  prefs);
		    				// setup the feed into the slider
				    		sliderobj.easySlider({
				    		        auto: true,
				    		        continuous: true,
				    		        numeric:true,
				    		        speed:prefs.bannerSpeed,
				    		        pause:prefs.bannerPause
				    		      }, setLookFeel(prefs));
				        }
				        else
				        {
				           if(prefs.showerrors)
    		  	 				logerror($(e).find('.rssError').text() + "<br> We tried connecting to : " + prefs.feedURL+ ", it's possible the link is down or not public. Please check the link and make sure your link is public.");
				        }
    		  });



    	  }catch(oError)
    	  {
    		  logger(oError.description);
    	  }


      /**
      *  process the body from feed.
      */
      function processBody(obj, prefs)
      {
    	  var divcount = prefs.feedPerBanner;
    	  var lastObjLI = null;
    	  $(obj).find('p[id=arbannerfeeds]').each(function(index){


    		  var contentfeed = $(this).context.nextSibling;

    		  // cleans up links to go to a new browser, since we are in a gadget
    		  // $(contentfeed).find('a:has(img)').each(function(){     // this one only does images
    		  $(contentfeed).find('a').each(function(){
    		      // $(this).attr('target','_top');// make all links go to the top
    		      $(this).attr('target','_blank'); // new browser
    		  });


    		  // <div class="bannercontent">
    		  var objLI = null;
    		  var objDIV = $('<div>').addClass('bannercontent');

          if ( $(this).context.innerHTML != null )
          {
            $($(this).context.innerHTML).appendTo(objDIV);
          }
// stopped working    		  $($(this).context.nextSibling.innerHTML).appendTo(objDIV);

          if(divcount == 1)
          {

              // append to a new LI
              if(lastObjLI != null)
                objLI = lastObjLI;
              else
                objLI = $('<li>').addClass('bannerbody');

              $(objDIV).appendTo(objLI);

    		      // and append the LI to slider
    		      $(objLI).appendTo('div#slider ul');
    		      divcount = prefs.feedPerBanner;
    		      lastObjLI = null;
    		  }
    		  else
    		  {
    		      // append to last LI
    		      if(lastObjLI == null)
    		      {
    		      	lastObjLI = $('<li>').addClass('bannerbody');
    		      }

    		      $(objDIV).appendTo(lastObjLI);
    		       divcount--;
    		  }

    		  logger(index + ': ' + '<li>'+$(this).context.innerHTML+'</li>');
	      });

	      if(lastObjLI != null)
	      {
	      	$(lastObjLI).appendTo('div#slider ul');
	      }

    	  /* debugging
    	  print("");
    	  print("");
    	  print("");
    	  print("<textarea rows='30' cols='20'>"+obj.html()+"</textarea>");
    	  */
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
			      'background-image' : 'https://gascripts.appspot.com/gassites/images/error_button_2.png',
			      'background-size'  : '60px 60px',
			      'color' : '#D8000C',
			      'border' : '1px solid',
			      'margin' : '10px 0px',
			      'padding': '15px 10px 15px 50px',
			      'background-color' : 'no-repeat',
			      'background-position' : '10px center',
			      'text-align' : 'left'
			    };

          msg = "Ops!  We had an error : <br>" + msg;
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
           var feedURL               = global_options.feedURL;
	       var bannerSpeed           = global_options.bannerSpeed;
	       var bannerPause           = global_options.bannerPause;
	       var bannerLOffset         = global_options.bannerLOffset;
	       var feedPerBanner         = global_options.feedPerBanner;
	       var feedLimit             = global_options.feedLimit;
	       var bannerHeight          = global_options.bannerHeight;
	       var bannerWidth           = global_options.bannerWidth;
	       var bannerBackGroundColor = global_options.bannerBackGroundColor;
		   var bannerFontSize        = global_options.bannerFontSize;
		   var showerrors            = global_options.showerrors;



		   if(!debuglocal)
		   {
      		   prefs = new _IG_Prefs(); // User preferences
      		   if(prefs.getString("feedURL") != '')
      		   		feedURL = prefs.getString("feedURL");

      		    if(prefs.getString("bannerSpeed") != '')
      		   		bannerSpeed = Number(prefs.getString("bannerSpeed"));

      		   	if(prefs.getString("bannerPause") != '')
      		   		bannerPause = Number(prefs.getString("bannerPause"));

      		   	if(prefs.getString("bannerLOffset") != '')
      		   		bannerLOffset = Number(prefs.getString("bannerLOffset"));

      		    if(prefs.getString("feedPerBanner") != '')
      		   		feedPerBanner = Number(prefs.getString("feedPerBanner"));

      		   	if(prefs.getString("feedLimit") != '')
      		   		feedLimit = prefs.getString("feedLimit");

      		   	if(prefs.getString("bannerHeight") != '')
      		   		bannerHeight = prefs.getString("bannerHeight");

      		   	if(prefs.getString("bannerWidth") != '')
      		   		bannerWidth = prefs.getString("bannerWidth");

      		    if(prefs.getString("bannerBackGroundColor") != '')
      		   		bannerBackGroundColor = prefs.getString("bannerBackGroundColor");

      		   	if(prefs.getString("bannerFontSize") != '')
      		   		bannerFontSize = prefs.getString("bannerFontSize");

      		   	if(prefs.getString("showerrors") != '')
	      		   	showerrors = prefs.getString("showerrors") == "false" ? false : true

      		    if(prefs.getString("debug") == 0)
      		    	debug = prefs.getString("debug") == "false" ? false : true

      	   }

      		hash.push('feedURL');
  			hash['feedURL'] = feedURL;

  			hash.push('bannerSpeed');
  			hash['bannerSpeed'] = bannerSpeed;

  			hash.push('bannerPause');
  			hash['bannerPause'] = bannerPause;

  			hash.push('bannerLOffset');
  			hash['bannerLOffset'] = bannerLOffset;

  			hash.push('feedPerBanner');
  			hash['feedPerBanner'] = feedPerBanner;

  			hash.push('feedLimit');
  			hash['feedLimit'] = feedLimit;

  			hash.push('bannerHeight');
  			hash['bannerHeight'] = bannerHeight;

  			hash.push('bannerWidth');
  			hash['bannerWidth'] = bannerWidth;

  			hash.push('bannerBackGroundColor');
  			hash['bannerBackGroundColor'] = bannerBackGroundColor;

  			hash.push('bannerFontSize');
  			hash['bannerFontSize'] = bannerFontSize;

  			hash.push('showerrors');
  			hash['showerrors'] = showerrors;

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

         if(prefs.bannerLOffset != null)
      			$('div#slider').css('margin-left',prefs.bannerLOffset);


      }

};

})(jQuery);
