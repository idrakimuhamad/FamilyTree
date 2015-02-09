PeopleSchemaObject = {
  name: {
    type: String
  },
  dob: {
    type: String,
    optional: true
  },
  isRoot: {
    type: Boolean,
    optional: true
  },
  familyId: {
    type: String
  },
  connectTo: {
    type: String,
    optional: true
  },
  spouseTo: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  },
  modifyAt: {
    type: Date
  },
  createdBy: {
    type: String
  }
};

People = new Mongo.Collection("people");
peopleSchema = new SimpleSchema(PeopleSchemaObject);
People.attachSchema(peopleSchema);

People.deny({
  update: function(userId, incident, fieldNames) {
    return false;
  }
});

People.allow({
  update: function(userId, doc){
    return false;
  },
  remove: function(userId, doc){
    return false;
  }
});

// -------------------------------------------------------------------------------- //
// ---------------------------- Create people ----------------------------------- //
// -------------------------------------------------------------------------------- //

createPeople = function (people, userId) {
  defaultProperties = {
    createdAt: new Date(),
    modifyAt: new Date(),
    createdBy: userId
  };

  people = _.extend(defaultProperties, people);

  // -------------------------------- Insert ------------------------------- //

  people._id = People.insert(people);

  // --------------------- Server-Side Async Callbacks --------------------- //

  if (Meteor.isServer) {
    // use defer to avoid holding up client
    Meteor.defer(function () {

    });
  }

  return people;
};

Meteor.methods({
  'createPeople': function (people) {
    return createPeople(people, this.userId);
  }
})


