android = global["android"] || {}

android.ContentResolver = function() {
}

_.extend(android.ContentResolver.prototype, {
  
  query: function(queryDef, resultsCallbackFunction, errorFunction) {
    PluginManager.addService("ContentResolverQuery","com.phonegap.ContentResolverQuery");
    PhoneGap.exec(resultsCallbackFunction, errorFunction, "ContentResolverQuery", "foo", [queryDef], true);
  }
  
})