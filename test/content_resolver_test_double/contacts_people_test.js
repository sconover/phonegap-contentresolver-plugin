require("./helper")

describe("content resolver test double - content://contacts/people", function() {
  
  beforeEach(function(){
    cr = new android.ContentResolverTestDouble('test/sampledata/')
  })
  
  it("brings back all the columns you'd expect from a people query", function(){
    cr.query({
      uri: "content://contacts/people",
      selection: "display_name like 'Amy%'"
    }, function(people) {
      expect(people).toEqual([
        { _id: '2', 
          displayName: 'Amy Jones', 
          lastTimeContacted: undefined, 
          name: 'Amy Jones', 
          number: undefined, 
          numberKey: undefined, 
          phoneticName: '', 
          primaryPhone: undefined, 
          sendToVoicemail: '0', 
          starred: '0', 
          timesContacted: '0', 
          type: undefined }
      ])
    })
  });
    
});

