android = global["android"] || {}

android.ContentResolverTestDouble = function(dbDirectory) {
  this.dbDirectory = dbDirectory
}

android.ContentResolver = android.ContentResolverTestDouble

_.extend(android.ContentResolverTestDouble.prototype, {
  executeSql: function(dbFile, sqlStatement) {
    throw "You must provide an implementation for android.ContentResolverTestDouble.prototype.executeSql.  " +
          "This is where you call out to your preferred method of accessing sqlite (ex: node-sqlite, html5 db, ruby/johnson/sqlite3-ruby)"
  },
  
  
  _crUrlInfo: function() {
    //_id displayName isprimary lastTimeContacted name number numberKey person phoneticName 
    // primaryPhone sendToVoicemail starred timesContacted type
    if (this._cachedCrUrlInfo) return this._cachedCrUrlInfo
    
    this._cachedCrUrlInfo = {}

    this._cachedCrUrlInfo["content://contacts/people"] = {
      dbFile: "contacts2.db",
      selectFrom: "view_v1_people",
      availableColumns: [
        "_id", "display_name", "last_time_contacted", "name", "number", "number_key", "phonetic_name", 
        "primary_phone", "send_to_voicemail", "starred", "times_contacted", "type"
      ]
    }


    this._cachedCrUrlInfo["content://sms/inbox"] = {
      dbFile: "mmssms.db",
      selectFrom: "sms",
      //for now, not supporting:
      //csTimestamp htcCategory csSynced toa indexOnSim priority callbackNumber scToa
      //not sure where these come from.
      availableColumns: [
        "_id", "address", "body", "date", "locked", "person", "protocol", "read", 
        "reply_path_present", "status", "thread_id", "type"
      ]      
    },
    
    this._cachedCrUrlInfo["content://sms/sent"] = this._cachedCrUrlInfo["content://sms/inbox"]
    
    return this._cachedCrUrlInfo
  },
  
  query: function(queryDef, resultsCallbackFunction) {
    var urlInfo = this._crUrlInfo()[queryDef.uri]
    if (!urlInfo) throw "url not supported: " + queryDef.uri
    
    var sqlStatment = "select "
    sqlStatment += (queryDef.projection ? _.keys(queryDef.projection) : urlInfo.availableColumns).join(",")
    sqlStatment += " from " + urlInfo.selectFrom
    if (queryDef.selection) sqlStatment += " where " + queryDef.selection
    if (queryDef.order) sqlStatment += " order by " + queryDef.order
    if (queryDef.limit) sqlStatment += " limit " + queryDef.limit
    
    this.executeSql(urlInfo.dbFile,
                    sqlStatment,
                    this.convertRowsFunction(queryDef.projection, resultsCallbackFunction))
  },
  
  convertRowsFunction: function(projection, resultsCallbackFunction) {
    var self = this
    return function(rows) {
      resultsCallbackFunction(_.map(rows, function(row) {
        var pureJsRow = {}
        for (k in row) {
          var value = row[k]
          if ((projection==undefined || projection[k]=="string") && (value || value==0)) {
            value = "" + value
          }
          pureJsRow[self._lowerCamel(k)] = value
        }
        return pureJsRow
      }))
    }
  },
  
  _lowerCamel: function(str) {
    this.strToLowerCamelCache = this.strToLowerCamelCache || {} 
    if (this.strToLowerCamelCache[str]) {
      return this.strToLowerCamelCache[str]
    } else {
      var converted = str.match(/^_/) ? str : this._inflectorJsCamelize(str, true)
      this.strToLowerCamelCache[str] = converted
      return converted
    }
  },
  
  //from http://code.google.com/p/inflection-js/, MIT license
  _inflectorJsCamelize: function(originalStr, lowFirstLetter) {
    var str = originalStr.toLowerCase();
    var str_path = str.split('/');
    for (var i = 0; i < str_path.length; i++)
    {
        var str_arr = str_path[i].split('_');
        var initX = ((lowFirstLetter && i + 1 === str_path.length) ? (1) : (0));
        for (var x = initX; x < str_arr.length; x++)
        {
            str_arr[x] = str_arr[x].charAt(0).toUpperCase() + str_arr[x].substring(1);
        }
        str_path[i] = str_arr.join('');
    }
    str = str_path.join('::');
    return str;
  }
  
  
})