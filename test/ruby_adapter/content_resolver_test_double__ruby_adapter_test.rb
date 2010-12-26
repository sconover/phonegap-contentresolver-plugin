require "test/ruby_adapter/test_helper"
require "json"

describe "content resolver test double - ruby adapter" do
  include JsSupport
  
  test "can execute sql.  uses johnson and sqlite3-ruby." do
    page = load_html_str(<<-HTML)
      <html>
        <head>
          <script>
            global = window
          </script>
          <script src="underscore.js"></script>
          <script src="content_resolver_test_double.js"></script>
          <script src="content_resolver_test_double__ruby_adapter.js"></script>            
          <script>
            var contactResolverTestDouble = new android.ContentResolverTestDouble('test/sampledata/')
          </script>
        </head>
        <html></html>
      </html> 
    HTML
    
    assert{
      page.result_for(%{
        var theResults = null
        
        resultsCallback = function(results) {
          theResults = results
        }
        
        contactResolverTestDouble.executeSql(
          'contacts2.db', 
          'select display_name from view_contacts order by display_name',
          resultsCallback
        )
        
        //rubyify
        var array = new Ruby.Array
        _.each(theResults, function(row){
          var h = new Ruby.Hash
          for (var k in row) {
            h[k] = row[k]
          }
          array.send('<<', h)
        })
        
        array
      }) == [
        {"display_name" => "Adam Miller"},
        {"display_name" => "Amy Jones"},
        {"display_name" => "Bob Barker"},
        {"display_name" => "Chris Smith"},
        {"display_name" => "Dan Draper"}
      ]
    }
  end

end