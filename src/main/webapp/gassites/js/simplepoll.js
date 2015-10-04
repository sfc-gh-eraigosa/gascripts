/*
 * 	gasScripts Simple Poll using MicroPoll
 *	written by xpandesiceng@yahoo.com
 *	http://gascripts.appspot.com/
 *
 *	Copyright (c) 2011 Raigosa.com Software Development Independent Contracting Services
 *	licensed http://www.gnu.org/licenses/gpl.txt licenses.
 *
 *       jQuery 1.7.1
 *    
 *  Objective of this script is to provide a way to insert MicroPoll polls into google site via app scripts.
 *   We try to make the insertion process of your polls simple.
 *
 *  Description:
 *       Installation of said gadgets can be purchased as a service by contacting xpandesiceng@yahoo.com.
 *    
 *
 */
var microPollWrites = "";
//override any document.write
$(function() {
	document.write = function(writtext) {
		microPollWrites += writtext;
	}


});
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
			$.ajaxSetup({
				cache: true
			});
			var optrespcheck = (prefs.pollmultivote > 0) ? "&responseCheck=false" : "";
			if (prefs.pollreset > 0)
				optrespcheck = "&responseCheck=false" ;

			var url = 	getProtocol() + "//www.micropoll.com/a/MicroPoll?id=" + prefs.pollid + optrespcheck;
			$.ajax({
				url: url,
				dataType: 'script',
				contentType: "text/javascript; charset=UTF-8",
				complete: function(xhr) { 
					if (xhr.status != 200) return;
					// load the document writes into our div
					try
					{  
						//pollData_2471313(document.getElementsByName('mp_2471313'))
						microPollWrites = "<script src=\"../js/simplepoll_after.js\"></script>" + microPollWrites;
						mainView.append(microPollWrites);
					}catch(e)
					{
						// 	console.log(e);
					}

					mainView.find('a[href*="micropoll"]').each(function(){
						$(this).attr('target','_top');// make all links go to the top
					});




					// if it is then set a new expires cookie if we have voted. 
					if(  prefs.pollreset > 0 )
					{
						getServerDate(function(){
							// check to see if localstorage is available.
							if($.jStorage.storageAvailable())
							{

								var options = {hoursToLive : (48 * 60 * 60 * 1000)};// 48 hours
								try
								{
									var date = ""
									try
									{
										date = Number(this.toString());
									}
									catch(e)
									{
										logger(e);
									}
								    date = (typeof(date) == "number" ) ? date : "";
									// determine if this is a new voter or we already voted.
									var votekey = "SimplePoll_" + prefs.pollid;
									var voteval =  $.jStorage.get(votekey, "");
									if(date != "" )
									{
										
										if(voteval != "")
										{
											// we have a poll cookie, determine if it's older than x minutes
											var voteage = date - voteval;
											var expiration = (prefs.pollreset * 1000 * 60 );
											if (voteage < expiration)
											{
												// the cookie hasn't aged, so just show the results.
												var call_results = 'renderResults_' + prefs.pollid;
												if(typeof(window[call_results]) == 'function')
												{
													var cb = window[call_results];
													cb.call();
												}
												return;
											}
											else
											{
												// the cookie is old, time to remove it
												try
												{
													$.jStorage.deleteKey(votekey);
												}
												catch(e)
												{
													logger("problem removing key : " + votekey )
													logger(e);
												}
												
											}

										}
										else
										{	// we havn't voted
											if($('#MicroPollResultsDiv_'+ prefs.pollid).length == 0)  // we are voting
											{
												var call_results = 'renderResults_' + prefs.pollid;
												
												var pollid = prefs.pollid;
												if(typeof(window[call_results]) == 'function')
												{
													var save_callres = window[call_results];
													var new_callres = function(){
														logger("calling poll results");
														$.jStorage.set(votekey, date);
														$.jStorage.setTTL(votekey, options.hoursToLive);
														logger("saved localstore: " + votekey + " = " + date + " expires in " + options.hoursToLive);
														save_callres.call();

													};
													window[call_results] = new_callres;
												}

											}
										}

									}
									else // we couldn't get the date time
									{
										if($('#MicroPollResultsDiv_'+ prefs.pollid).length == 0)  // we are voting
										{
											var call_results = 'pollData_' + prefs.pollid;
											var pollid = prefs.pollid;
											if(typeof(window[call_results]) == 'function')
											{
												var new_callres = function(){
													logger("no connection to time server");
													alert("Connection to our time server could not be established.  Please refresh your browser and try to vote again later.");
												};
												window[call_results] = new_callres;
											}

										}
										// Can't get the time.
										logerror("Connection to our time server could not be established.  Please refresh your browser and try to vote again later.");
									
									}

								}catch(e)
								{
									logger("problem setting localstorage");
									logger(e);
									logerror("We're sorry, but there was an unknown error that occured while trying to vote. Please refresh your browser and try again later. " + e);

									if($('#MicroPollResultsDiv_'+ prefs.pollid).length == 0)  // we are voting
									{
										var call_results = 'pollData_' + prefs.pollid;
										var datetime = this.toString();
										var pollid = prefs.pollid;
										if(typeof(window[call_results]) == 'function')
										{
											var new_callres = function(){
												logger("unknown error");
												alert("We're sorry, but there was an unknown error that occured while trying to vote. Please refresh your browser and try again later. " + e);
											};
											window[call_results] = new_callres;
										}

									}
								}
								logger("getdate complete");
							}
							else
							{
								// check to see if cookie age is older than x hrs
								// if not, then render the results
								logerror("We're sorry, but you need to have browser localstorage feature available with html5.  You may have to use a newer browser.");

								if($('#MicroPollResultsDiv_'+ prefs.pollid).length == 0)  // we are voting
								{
									var call_results = 'pollData_' + prefs.pollid;
									var datetime = this.toString();
									var pollid = prefs.pollid;
									if(typeof(window[call_results]) == 'function')
									{
										var new_callres = function(){
											logger("localstore alert");
											alert("We're sorry, but you need to have browser localstorage feature available with html5.  You may have to use a newer browser.");
										};
										window[call_results] = new_callres;
									}

								}
								logger("not working");
							}

						});
					}   



				},
				error: function(err) {
					logerror("Failed to get poll : " + err);
				}
			});

			// $.getScript(getProtocol() +"//www.micropoll.com/a/MicroPoll?id=" + prefs.pollid);
			logger("poll id : " + prefs.pollid);



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
		 * get server date
		 */
		function getServerDate(call_back)
		{
			var serverDateURL = null;
			serverDateURL = getProtocol() + '//gascripts.appspot.com/gassites';
			// serverDateURL = 'http://localhost:8888/gassites';
			var date = "";
			$.ajax({
				url: serverDateURL,
				dataType: 'json',
				//  contentType: "text/javascript; charset=UTF-8",
				complete: function(xhr) { 
					if (xhr.status != 200) return;
					// load the document writes into our div
					try
					{  
						var DateTime = $.parseJSON(xhr.responseText);
						date = DateTime.Time;
						//  date = xhr.responseText.trim().split(':')[1].trim();
					}catch(e)
					{
						date = "";
					}
					return call_back.call(date);
				},
				error: function(err) {
					date = "";
					return call_back.call(date);
				}
			});



		}

		/*
		 * logerror(msg)
		 */
		function logerror(msg)
		{
			var cssErrorObj = {
					'background-color' : '#FFBABA',
					'background-image' : getProtocol() + '//gascripts.appspot.com/gassites/images/error_button_2.png',
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
			var pollid = '2471313'; // default feed
			var pollreset = -1;  // minutes
			var pollmultivote = 0;

			var showerrors = true;
			var qs = QueryString();

			if(!("pollid" in qs))
			{
				logerror("We need a polid.  Please check your api key and selection.");
				return;
			}

			if("pollid" in qs)
				pollid = qs['pollid'];

			if("pollreset" in qs)
				pollreset = qs['pollreset'];

			if("pollmultivote" in qs)
				pollmultivote = qs['pollmultivote'];

			if("showerrors" in qs)
				showerrors = qs["showerrors"].toLowerCase() == "on" ? true : false;

			if("debug" in qs)
				debug = qs["debug"].toLowerCase()  == "on" ? true : false;

			hash.push('pollid');
			hash['pollid'] = pollid;

			hash.push('showerrors');
			hash['showerrors'] = showerrors;

			hash.push('debug');
			hash['debug'] = debug;

			hash.push('pollreset');
			hash['pollreset'] = pollreset;

			hash.push('pollmultivote');
			hash['pollmultivote'] = pollmultivote;

			return hash;
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

