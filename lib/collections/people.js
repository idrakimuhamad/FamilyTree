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
  children: {
    type: [String],
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

addChild = function (people, parent, userId) {
  var id = createPeople(people, userId);

  People.update({ _id: parent }, {
    $push : {
      "children": id._id
    }
  });

  return id;
}

Meteor.methods({
  'createPeople': function (people) {
    return createPeople(people, this.userId);
  },
  'addChild': function (people, parent) {
    return addChild(people, parent, this.userId)
  }
})


