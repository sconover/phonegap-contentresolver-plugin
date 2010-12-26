var sys    = require('sys'),
    path = require("path"),
    sqlite = require('sqlite');
    
android.ContentResolverTestDouble.prototype.executeSql = function(dbFile, sqlStatement, resultsCallback) {
  var dbFilePath = this.dbDirectory + dbFile
  if (!path.existsSync(dbFilePath)) { throw dbFilePath + " not found"; }
  
  var db = sqlite.openDatabaseSync(dbFilePath);
  db.query(sqlStatement, function(rows){  
    var pureArray = []
    _.each(rows, function(row){pureArray.push(row)})
    resultsCallback(pureArray)
  })
}