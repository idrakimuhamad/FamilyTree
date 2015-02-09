FamilychemaObject = {
  name: {
    type: String
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

Family = new Mongo.Collection("family");
FamilySchema = new SimpleSchema(FamilychemaObject);
Family.attachSchema(FamilySchema);

Family.deny({
  update: function(userId, incident, fieldNames) {
    return false;
  }
});

Family.allow({
  update: function(userId, doc){
    return false;
  },
  remove: function(userId, doc){
    return false;
  }
});

// -------------------------------------------------------------------------------- //
// ---------------------------- Create Family ----------------------------------- //
// -------------------------------------------------------------------------------- //

createFamily = function (family, userId) {
  defaultProperties = {
    createdAt: new Date(),
    modifyAt: new Date(),
    createdBy: userId
  };

  family = _.extend(defaultProperties, family);

  // -------------------------------- Insert ------------------------------- //

  family._id = Family.insert(family);

  // --------------------- Server-Side Async Callbacks --------------------- //

  if (Meteor.isServer) {
    // use defer to avoid holding up client
    Meteor.defer(function () {

    });
  }

  return family;
};

Meteor.methods({
  'createFamily': function (family) {
    return createFamily(family, this.userId);
  }
})


