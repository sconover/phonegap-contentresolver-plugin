require("../helper")
require("content_resolver_test_double")
require("content_resolver_test_double__node_adapter")

describe("content resolver test double - node adapter", function() {
  
  it("can execute sql.  uses node-sqlite.", function(){
    var contactResolverTestDouble = new android.ContentResolverTestDouble('test/sampledata/')
    
    contactResolverTestDouble.executeSql(
      'contacts2.db', 
      'select display_name from view_contacts order by display_name',
      function(rows){
        expect(rows).toEqual([
          {"display_name": "Adam Miller"},
          {"display_name": "Amy Jones"},
          {"display_name": "Bob Barker"},
          {"display_name": "Chris Smith"},
          {"display_name": "Dan Draper"}
        ])
      }
    )
  });
});

