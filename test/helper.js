require.paths.push("assets/www")
require.paths.push("underscore")
require.paths.push("test")
require.paths.push("../node-sqlite")

require("underscore")
require("../../jasmine-node/lib/jasmine")

for(var key in jasmine) {
  global[key] = jasmine[key]
}