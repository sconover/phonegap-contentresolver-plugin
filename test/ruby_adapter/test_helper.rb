require "rubygems"
require "minitest/spec"
require "pp"

require "wrong"
require "wrong/adapters/minitest"
require "wrong/message/test_context"
require "wrong/message/string_comparison"
Wrong.config[:color] = true

module Kernel
  alias_method :regarding, :describe
  
  def xdescribe(str)
    puts "x'd out 'describe \"#{str}\"'"
  end
end

class MiniTest::Spec
  class << self
    alias_method :test, :it
    
    def xtest(str)
      puts "x'd out 'test \"#{str}\"'"
    end
  end
end



require "harmony"

class Harmony::Page
  alias_method :original_execute_js, :execute_js
  
  def execute_js(str)
    original_execute_js(str)
    self
  end
  
  def result_for(str)
    original_execute_js(str)
  end

  def _wait
    execute_js(%{Envjs.wait(-1);})
  end
end

module JsSupport
  def load_html_str(html, prepend="")
    html = html.gsub(/src="(.*)\.js"/) do 
      %{src="file://#{FileUtils.pwd}/assets/www/#{$1}.js"}
    end
    
    page = Harmony::Page.new(prepend + html)
    page._wait
    page
  end
end

MiniTest::Unit.autorun