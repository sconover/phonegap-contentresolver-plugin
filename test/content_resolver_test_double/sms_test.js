require("./helper")

describe("content resolver test double - content://sms/inbox, content://sms/outbox", function() {
  
  beforeEach(function(){
    cr = new android.ContentResolverTestDouble('test/sampledata/')
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
          type: '2' }
      ])
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
    
});

