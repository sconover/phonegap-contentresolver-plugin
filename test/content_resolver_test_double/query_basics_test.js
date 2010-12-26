require("./helper")

describe("query basics test (using content://contacts/people)", function() {
  
  beforeEach(function(){
    cr = new android.ContentResolverTestDouble('test/sampledata/')
  })
  
  it("uses selection as where clause, also order", function(){
    cr.query({
      uri: "content://contacts/people",
      selection: "display_name like 'Amy%' or display_name like 'Bob%'",
      order: "display_name"
    }, function(people) {
      var justDisplayNames = _.map(people, function(person){return person.displayName})
      expect(justDisplayNames).toEqual(['Amy Jones', 'Bob Barker'])
    })
  });    

  it("uses projection as the select clause", function(){
    cr.query({
      uri: "content://contacts/people",
      projection: { "display_name": "string" },
      selection: "display_name like 'Amy%'"
    }, function(people) {
      expect(people).toEqual([{displayName: 'Amy Jones'}])
    })
  });    
  
  it("uses projection types to determine whether the value is a string or not", function(){
    cr.query({
      uri: "content://contacts/people",
      projection: {"_id": "string" },
      selection: "display_name like 'Amy%'"
    }, function(people) {
      expect(people).toEqual([{_id: '2'}])
    })

    cr.query({
      uri: "content://contacts/people",
      projection: {"_id": "long" },
      selection: "display_name like 'Amy%'"
    }, function(people) {
      expect(people).toEqual([{_id: 2}])
    })
  });
  
  it("orders descending", function(){
    cr.query({
      uri: "content://contacts/people",
      projection: { "display_name": "string" },
      selection: "display_name like 'Amy%' or display_name like 'Bob%'",
      order: "display_name DESC"
    }, function(people) {
      expect(people).toEqual([{displayName:'Bob Barker'}, {displayName:'Amy Jones'}])
    })
  });    

  it("works without a selection", function(){
    cr.query({
      uri: "content://contacts/people",
      projection: { "display_name": "string" },
      order: "display_name ASC"
    }, function(people) {
      expect(people).toEqual([
        {displayName: "Adam Miller"},
        {displayName: "Amy Jones"},
        {displayName: "Bob Barker"},
        {displayName: "Chris Smith"},
        {displayName: "Dan Draper"}
      ])
    })
  });    

  
  
});

