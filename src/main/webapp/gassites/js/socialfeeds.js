/*
* PayPal Donate Button
* written by xpandesiceng@yahoo.com
* http://gascripts.appspot.com/
*
* Copyright (c) 2011 Raigosa.com Software Development Independent Contracting Services
* Dual licensed http://www.gnu.org/licenses/gpl.txt licenses.
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

  $.fn.initSFeed = function(){


    // debug flag. When its value is non-zero, debugging messages are displayed
    var debug = 1;
    var debug_html = '';
    // The string containing debugging messages
    var mainView = $(this);
    var prefs = null;
    try
    {
      prefs = loadGadgetPrefs();
      $('div#fb-page').prop('data-href',prefs.socialfeedurl)
      $('blockquote#fb-cite').prop('cite',prefs.socialfeedurl)
      $('a#fb-href').prop('href',prefs.socialfeedurl)
      $('div#fb-page').prop('data-height',prefs.innerheight)
      $('div#fb-page').prop('data-width',prefs.innerwidth)
      $('div#header_html').append(prefs.headerhtml);
      $('div#footer_html').append(prefs.footerhtml);

      logger("debug : "         + prefs.debug);
      logger("socialfeedurl : " + prefs.socialfeedurl);
      logger("header : "        + prefs.headerhtml);
      logger("footer : "        + prefs.footerhtml);
      logger("innerwidth : "    + prefs.innerwidth);
      logger("innerheight : "   + prefs.innerheight);
    }
    catch(oError)
    {
      logger(oError.description + ' ' + oError.type);
    }

       // Outputs debug messages if debug flag has a non-zero value
      function logger(msg) {
        prefs = loadGadgetPrefs();
        if (prefs.debug) {
          debug_html += msg + "<BR>";
          $("div#debug").empty();
          $("div#debug").append(debug_html);
        } else {
          console.log(msg)
        }
      }
      /*
      * logerror(msg)
      */
      function logerror(msg)
      {
        var cssErrorObj = {
          'background-color' : '#FFBABA',
          'background-image' : '/gassites/images/error_button_2.png',
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
        var header_html = ''; // header for feed
        var footer_html = ''; // footer for feed
        var social_feed_url = 'https://www.facebook.com/facebook';
        var inner_width  = '500';
        var inner_height = '600';

        var showerrors = true;
        var debug = false;
        var qs = QueryString();

        //  if(!("test" in qs))
        //  {
        //     logerror("We need a test parameter.  Please fix your options.");
        //     return;
        //  }

        if("socialfeedurl" in qs)
          social_feed_url = qs['socialfeedurl'];

        if("innerwidth" in qs)
          inner_width = qs['innerwidth'];

        if("innerheight" in qs)
          inner_height = qs['innerheight'];

        if("headerhtml" in qs)
          header_html = qs['headerhtml'];

        if("footerhtml" in qs)
          footer_html = qs['footerhtml'];

        if("showerrors" in qs)
          showerrors = qs["showerrors"].toLowerCase() == "on" ? true : false;

        if("debug" in qs)
          debug = qs["debug"].toLowerCase()  == "on" ? true : false;

        hash.push('socialfeedurl');
          hash['socialfeedurl'] = social_feed_url;

        hash.push('innerwidth');
          hash['innerwidth'] = inner_width;

        hash.push('innerheight');
          hash['innerheight'] = inner_height;

        hash.push('headerhtml');
          hash['headerhtml'] = header_html;

        hash.push('footerhtml');
          hash['footerhtml'] = footer_html;

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
