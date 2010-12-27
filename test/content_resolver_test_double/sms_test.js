require("./helper")

var sys    = require('sys'),
    path = require("path"),
    sqlite = require('sqlite');

describe("content resolver test double - content://sms/inbox, content://sms/outbox", function() {
  
  beforeEach(function(){
    cr = new android.ContentResolverTestDouble('test/sampledata/')

    var db = sqlite.openDatabaseSync('test/sampledata/mmssms.db');
    db.query("update sms set type=1 where body like '%weather%'")
  })
  
  it("brings back all the columns you'd expect from a sms inbox query", function(){
    cr.query({
      uri: "content://sms/inbox",
      selection: "body like '%weather%'"
    }, function(messages) {
            
      expect(messages).toEqual([
        { _id: '1', 
          address: '415-555-1002', 
          body: "Hey how's the weather today?", 
          date: '617009282', 
          locked: '0', 
          person: undefined, 
          protocol: undefined, 
          read: '1', 
          replyPathPresent: undefined, 
          status: '-1', 
          threadId: '1', 
          type: '1' }
      ])
    })
  });
  
  it("only returns messages from the inbox", function(){
    cr.query({
      uri: "content://sms/inbox",
      projection:{"body": "string"}
    }, function(messages) {
      var messageBodies = _.map(messages, function(message){return message.body}).join(" / ")
      expect(messageBodies).toMatch("weather")
      expect(messageBodies).toNotMatch("people")
    })
  });
  
  it("brings back all the columns you'd expect from a sms outbox query", function(){
    cr.query({
      uri: "content://sms/sent",
      selection: "body like '%people%'"
    }, function(messages) {
            
      expect(messages).toEqual([
        
        { _id: '2', 
          address: '415-555-1002', 
          body: "What's up, people?", 
          date: '617049694', 
          locked: '0', 
          person: undefined, 
          protocol: undefined, 
          read: '1', 
          replyPathPresent: undefined, 
          status: '-1', 
          threadId: '2', 
          type: '2' }, 
        { _id: '3', 
          address: '415-555-1003', 
          body: "What's up, people?", 
          date: '617049694', 
          locked: '0', 
          person: undefined, 
          protocol: undefined, 
          read: '1', 
          replyPathPresent: undefined, 
          status: '-1', 
          threadId: '2', 
          type: '2' }
        
      ])
    })
  });

  it("only returns messages from sent", function(){
    cr.query({
      uri: "content://sms/sent",
      projection:{"body": "string"}
    }, function(messages) {
      var messageBodies = _.map(messages, function(message){return message.body}).join(" / ")
      expect(messageBodies).toMatch("people")
      expect(messageBodies).toNotMatch("weather")
    })
  });
  

    
});

