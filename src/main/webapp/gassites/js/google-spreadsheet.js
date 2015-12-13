/*
Updated versions can be found at https://github.com/mikeymckay/google-spreadsheet-javascript
*/var GoogleSpreadsheet, GoogleUrl;
GoogleUrl = (function() {
  /*
   * GoogleUrl object  - build a url object to find possible combinations of links to google data.
   *   - this.url = the url for the google spreadsheet.
   *   - this.type = the type of url the google spreadsheet is for.
   *   - this.key = google spreadsheet identifier or key.
   *   - this.worksheetid = the worksheet unique identifier.
   *   - this.jsonCellUrl = the url for cell data
   *   - this.jsonListUrl = the url for data in list format
   *   - this.jsonWorksheetUrl = the url for worksheets names
   *   - this.jsonUrl = the default data feed url
   *   - this.sourceIdentifier = typically the url, can also be a key, input to be parsed.
   */
  function GoogleUrl(sourceIdentifier, wskey ) {
	this.worksheetid = (typeof(wskey) == 'undefined') ?  'od6' : wskey ;
    this.sourceIdentifier = sourceIdentifier;
    if (this.sourceIdentifier.match(/http(s)*:/)) {
      this.url = this.sourceIdentifier;
      if(this.url.indexOf('feeds\/cells') > 0)
    	  this.type = "cells";
      else if(this.url.indexOf('feeds\/list') > 0)
    	  this.type = "list";
      else if(this.url.indexOf('feeds\/worksheets') > 0)
    	  this.type = "worksheets";
      else
    	  this.type = "cells";
    	  
      try {
    	  if(this.url.indexOf('key') > 0)
		  {
    		  this.key = this.url.match(/key=(.*?)&/)[1];
		  }else if(this.url.indexOf('worksheets') > 0)
		  {
			  this.key = this.url.match(/(worksheets)\/(.*?)\//)[2];
			  this.worksheetid = (typeof(this.worksheetid) == 'undefined') ?  'od6' : this.worksheetid ;
		  }else 
		  {
			  this.key = this.url.match(/key=(.*?)&/)[1];
		  }
        
      } catch (error) {
        this.key = this.url.match(/(cells|list)\/(.*?)\//)[2];
        this.worksheetid = this.url.match(/(cells|list)\/(.*?)\/(.*?)\//)[3];
      }
    } else {
      this.key = this.sourceIdentifier;
      this.type = "cells";
    }
   
    
    this.jsonCellsUrl = getProtocol() + "//spreadsheets.google.com/feeds/cells/" + this.key + "/" + this.worksheetid + "/public/basic?alt=json-in-script";
    this.jsonListUrl = getProtocol() + "//spreadsheets.google.com/feeds/list/" + this.key + "/" + this.worksheetid + "/public/basic?alt=json-in-script";
    this.jsonWorksheetUrl = getProtocol() + "//spreadsheets.google.com/feeds/worksheets/" + this.key + "/public/basic?alt=json-in-script";
    if(this.type == 'cells' )
    	this.jsonUrl = this.jsonCellsUrl;
    else if(this.type == 'list')
    	this.jsonUrl = this.jsonListUrl;
    else if(this.type == 'worksheets')
    	this.jsonUrl = this.jsonWorksheetUrl;
    else
    	this.jsonUrl = this.jsonCellsUrl;
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
  return GoogleUrl;
})();

  /*
   * GoogleSpreadsheet boject
   * 
   */
GoogleSpreadsheet = (function() {
  function GoogleSpreadsheet() {}
  /*
   * load - load the spreadsheet, accepts a callback function.
   * 
   */
  GoogleSpreadsheet.prototype.load = function(callback) {
    var intervalId, jsonUrl, safetyCounter, url, waitUntilLoaded;
    var type, worksheetid;
    if(this.type == 'worksheets')
    	url = this.googleUrlObj.jsonWorksheetUrl + "&callback=GoogleSpreadsheet.callbackSheetNames"; // name of the call back function to use.
    else
    	url = this.googleUrlObj.jsonCellsUrl + "&callback=GoogleSpreadsheet.callbackCells"; // name of the call back function to use.
    
    $('body').append("<script src='" + url + "'/>");
    jsonUrl = this.jsonUrl; // the default spreadsheet url loaded.
    type = this.type;
    worksheetid = this.worksheetid;
    safetyCounter = 0;
    waitUntilLoaded = function() {
      var result;
      result = GoogleSpreadsheet.find({
        jsonUrl: jsonUrl,
        localStoreKey : type + worksheetid
      });
      if (safetyCounter++ > 40 || ((result != null) && (result.data != null))) {
        clearInterval(intervalId);
        return callback(result);
      }
    };
    intervalId = setInterval(waitUntilLoaded, 200);
    if (typeof result != "undefined" && result !== null) {
      return result;
    }
  };
  /*
   * set the url that we want to display
   */
  GoogleSpreadsheet.prototype.seturl = function(url, wskey) {
	  
    return this.googleUrl(new GoogleUrl(url, wskey));
  };
  
  /*
   * save the input url 
   */
  GoogleSpreadsheet.prototype.googleUrl = function(googleUrl) {
    if (typeof googleUrl === "string") {
      throw "Invalid url, expecting object not string";
    }
    this.url = googleUrl.url;
    this.key = googleUrl.key;
    this.worksheetid = googleUrl.worksheetid;
    this.jsonUrl = googleUrl.jsonUrl;
    this.type = googleUrl.type;
    return this.googleUrlObj = googleUrl;
  };
  /*
   * get the worksheet url
   */
  GoogleSpreadsheet.prototype.getWorksheetUrl = function() {
	    return this.googleUrlObj.jsonWorksheetUrl;
	  };
  /*
   * get data named data rows from spreadsheet
   * maxrows - don't pull more than maxrows
   * addrows - pull an additional number of rows that are blank from the sheet.
   */
  GoogleSpreadsheet.prototype.getNamedDataRows = function(maxrows, addrows) {
	  var results = [];
	  var arrCol = [];
	  
	
	  var totalrows = this.getTotalRows();
	  var totalcols = this.getTotalColumns();
	  if(typeof(maxrows) != 'undefined' && maxrows != null)
	  {
		  if(maxrows <= totalrows)
			  totalrows = maxrows;
	  }
	  var maxrows = 0;
	  var colnames = "";
	  for(var col = 1; col <= totalcols; col++)
	  {
		  var header = null;
		  var arrRows = [];
		  for(var row = 1; row <= totalrows; row++)
		  {
			 
			  var val = this.getValue(row,col);
			  if(row == 1)
			  {
				header = val;
				arrCol[header] = null;
			  }
			  else
			  {
				  if(maxrows <= row)
					  maxrows = row - 1;
				  
				  arrRows.push(val);
		 		
			  }
		  }
		  if(typeof(addrows) != 'undefined' && addrows != null)
		  {
			  for(var row=1 ; row <= addrows ; row++)
			  {
				  arrRows.push(null);
			  }
		  }
		  if(colnames == "")
			  colnames = header;
		  else
			  colnames = colnames + "," + header;
		  
		  arrCol[header] = arrRows;
	  }
	  arrCol["ColumnNames"] = colnames;
	  arrCol["MaxRows"] = maxrows;
	  results.push(arrCol);

	  
	  return results;
  }
  /*
   * get total rows.
   */  
  GoogleSpreadsheet.prototype.getTotalRows = function() {
		var result;
		result = 0;
		if(typeof(this.cells) == 'undefined')
			return result;
		
		for(index = 0 ; index < this.cells.length; index++)
		{
			var cell = this.cells[index];
			var match = cell.id.match(/\d*$/);
			if(typeof(match)!= 'undefined')
			{
				if(match.index > 0)
				{
					var row = Number(match[0]);
					if(result < row)
						result = row;
				}
			}
		}
		return result;
   };  
   /*
    * get total column size
    */
   GoogleSpreadsheet.prototype.getTotalColumns = function() {
		var result;
		result = 0;
		if(typeof(this.cells) == 'undefined')
			return result;
		
		var letters = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
		var col_letters = [];
		for(i =0 ; i < letters.length; i++ )
		{
			col_letters.push(letters[i]);
			col_letters[letters[i]] = i + 1;
		}
			
		
		
		for(index = 0 ; index < this.cells.length; index++)
		{
			var cell = this.cells[index];
			var match = cell.id.toLowerCase().match(/([a-z])/gi);
			if(typeof(match)!= 'undefined')
			{
				var colpos = 0;
				for(ncol = 0 ; ncol < match.length; ncol++)
				{
					colpos =(colpos * letters.length)+ col_letters[match[ncol]] ;
				}
				if(result < colpos)
					result = colpos;
			}
		}
		return result;
  }; 
  
  /*
   * get total column size
   */
  GoogleSpreadsheet.prototype.getValue = function(row, col) {
		var result;
		result = '';
		//input validation
		if(typeof(this.cells) == 'undefined')
			return result;
		
		if(!GoogleSpreadsheet.isNumeric(row + col))
			return result;
		
		if(row < 0)
			return result;
		
		if(col < 0)
			return result;
		
		if(col > 51)
		{
			// we have a bug in this algorithm, it doesn't support more than 51 columns correct.
			return result;
		}
		
		
		var letters = new Array('z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y');
		var col_letters = [];
		for(i =0 ; i < letters.length; i++ )
		{
			col_letters.push(letters[i]);
			col_letters[letters[i]] = i + 1;
		}
		
		// lets first identify the letter for the column
		// lets first identify the letter for the column

		var remainder;
		var base = letters.length;

                var result = '';
               
                var number = col;
                var dec_num;
                for( i = base; i > 0 ; i--)
                {
                   
                    
                    dec_num = (number/base) ;
                    
                    remainder =  number % base    ;
                   // result = (remainder == 0) ?   letters[base - 1] + result :   letters[remainder - 1] + result;
                    var letter = letters[remainder];
                    result = letter + result;
                    
                    //$('#result3').append(letter + ' : ' + Math.floor( dec_num) + ' '+ number + ' ' + dec_num + ' '+ remainder + ' ');  //troubleshooting.
                    
                    
                    number = Math.floor( dec_num);
                    
                    
                    if(dec_num <= 1) 
                              break;

                       
                }
		result = result.toUpperCase() + row;
		var searchid = result ; 
		result = '';
		for(index = 0 ; index < this.cells.length; index++)
		{
			var cell = this.cells[index];
			if(cell.id == searchid)
			{
				result = cell.content;
				break;
			}	
			
		}
		
		return result;
 }; 
   
  /*
   * save the results in a local store.
   */
  GoogleSpreadsheet.prototype.save = function() {
    return localStorage["GoogleSpreadsheet." + this.type + this.worksheetid] = JSON.stringify(this);
  };
  return GoogleSpreadsheet;
})();
/*
 * bless object
 */
GoogleSpreadsheet.bless = function(object) {
  var key, result, value;
  result = new GoogleSpreadsheet();
  for (key in object) {
    value = object[key];
    result[key] = value;
  }
  return result;
};
/*
 * make sure we're dealing with numbers
 */
 GoogleSpreadsheet.isNumeric = function(value) {
	  if (value == null || !value.toString().match(/^[-]?\d*\.?\d*$/)) return false;
	  return true;
}
/*
 * find if the data is in the local store yet.
 */
GoogleSpreadsheet.find = function(params) {
  var item, itemObject, key, value, _i, _len;
  try {
    for (item in localStorage) {
      if (item.match(/^GoogleSpreadsheet\./)) {
    	if(item.indexOf(params.localStoreKey) >= 0)
		{
    		itemObject = JSON.parse(localStorage[item]);
            // for (key in params) {
              // value = params[key];
              // if (itemObject[key] === value) {
                return GoogleSpreadsheet.bless(itemObject);
              // }
            // }
		}
      }
    }
  } catch (error) { //IE5 search
    for (_i = 0, _len = localStorage.length; _i < _len; _i++) {
      item = localStorage[_i];
      if (item.match(/^GoogleSpreadsheet\./)) {
    	if(item.indexOf(params.localStoreKey) >= 0)
  		{
	        itemObject = JSON.parse(localStorage[item]);  // convert to json
	        for (key in params) {
	          value = params[key];
	          if (itemObject[key] === value) {
	            return GoogleSpreadsheet.bless(itemObject);
	          }
	        }
  		}
      }
    }
  }
  return null;
};


/*
 * call back handler for cells url.
 */
GoogleSpreadsheet.callbackSheetNames = function(data) {
	  var cell, googleSpreadsheet, googleUrl;
	  googleUrl = new GoogleUrl(data.feed.id.$t);
	  googleSpreadsheet = GoogleSpreadsheet.find({
	    jsonUrl: googleUrl.jsonUrl,
        localStoreKey : googleUrl.type + googleUrl.worksheetid
	  });
	  if (googleSpreadsheet === null) {
	    googleSpreadsheet = new GoogleSpreadsheet();
	    googleSpreadsheet.googleUrl(googleUrl);
	  }
	  googleSpreadsheet.data = (function() {
		    var _i, _len, _ref, _results;
		    _ref = data.feed.entry;
		    Worksheet = (function() {
		    	  function Worksheet(name, url ) {
		    		this.name = name;
		    		this.url = url;
		    	    
		    	  }
		    	  return Worksheet;
		    	})();
		    _results = [];
		    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		      cell = _ref[_i];
		      var _ws = new Worksheet(cell.title.$t, cell.link[1].href);
	    	  _results.push(_ws);
		    }
		    return _results;
		  })();
	  googleSpreadsheet.save();
	  return googleSpreadsheet;
};	  
/*
 * call back handler for worksheets url.
 */
GoogleSpreadsheet.callbackCells = function(data) {
  var cell, googleSpreadsheet, googleUrl;
  googleUrl = new GoogleUrl(data.feed.id.$t);
  googleSpreadsheet = GoogleSpreadsheet.find({
    jsonUrl: googleUrl.jsonUrl,
    localStoreKey : googleUrl.type + googleUrl.worksheetid
  });
  if (googleSpreadsheet === null) {
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.googleUrl(googleUrl);
  }
  googleSpreadsheet.cells = (function()
  {
	  var _i, _len, _ref, _results;
	    _ref = data.feed.entry;
	    SheetCell = (function() {
	    	  function SheetCell(id, content ) {
	    		this.id = id;
	    		this.content = content;
	    	    
	    	  }
	    	  return SheetCell;
	    	})();
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      cell = _ref[_i];
	      var _content = cell.content.$t;
	      var _title = cell.title.$t;
	      var _pair = [];
	      _pair[_title] = _content;
	      _results.push(_pair);
	    }
	    _results.sort();
	    
	    var _sresults = [] ;
	    for(_i = 0; _i < _results.length; _i++)
    	{
	    	for(key in _results[_i])
    		{
	    		var _sc = new SheetCell(key, _results[_i][key]);
	    		_sresults.push(_sc);
    		}
	    }
	    return _sresults;
  })();
  googleSpreadsheet.data = (function() {
    var _i, _len, _ref, _results;
    _ref = data.feed.entry;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cell = _ref[_i];
      _results.push(cell.content.$t);
    }
    return _results;
  })();
  googleSpreadsheet.save();
  return googleSpreadsheet;
};
/* TODO (Handle row based data)
GoogleSpreadsheet.callbackList = (data) ->*/