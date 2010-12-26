Ruby.require("sqlite3")

android.ContentResolverTestDouble.prototype.executeSql = function(dbFile, sqlStatement, resultsCallback) {
  var dbFilePath = this.dbDirectory + dbFile
  
  if (!Ruby.eval("File.exists?('" + dbFilePath + "')")) {
    throw dbFilePath + " not found"
  }
  var db = Ruby.SQLite3.Database.new(dbFilePath)
  db.results_as_hash = true
  var results = db.execute(sqlStatement)
  var resultsWithoutNumericColumns = 
    _.map(results,function(row){
      
      var pureJsRow = {}
      _.each(row.keys(), function(key){
        pureJsRow[key] = row[key]
      })      
      
      var keysToDelete = _.select(_.keys(pureJsRow), function(key){return key.match(/^\d+$/)})
      _.each(keysToDelete, function(keyToDelete){ delete pureJsRow[keyToDelete] })
      return pureJsRow
    })
  resultsCallback(resultsWithoutNumericColumns)
}
