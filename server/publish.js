Meteor.publish('family', function (userId) {
  return Family.find({ createdBy: userId });
});

Meteor.publish('people', function (familyId) {
  return People.find(
    { familyId: familyId },
    {
      fields: {name: 1, dob: 1, familyId: 1, children: 1, isRoot: 1 },
      sort: { dob: 1 }
    });
});

Meteor.publish('peoplesInFamily', function (familyId) {
  
  // Based on Meteor docs.

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var self = this;
  var initializing = true;  
  var descendants = new Mongo.Collection(null);
  
  var handle = People.find({ familyId: familyId }).observeChanges({
    added: function (id, field) {
      descendants = new Mongo.Collection(null);
      prepareFamilyTreeData(familyId, descendants);
      if (!initializing)
        self.changed('people', descendants.find().fetch()[0]._id, descendants.find().fetch()[0]);
    },
    removed: function (id) {
      descendants = new Mongo.Collection(null);
      prepareFamilyTreeData(familyId, descendants);
      self.cahnged('people', descendants.find().fetch()[0]._id, descendants.find().fetch()[0]);
    }
  });
  
  prepareFamilyTreeData(familyId, descendants);
  
  initializing = false;
  self.added('people', descendants.find().fetch()[0]._id, descendants.find().fetch()[0]);
  self.ready();
  self.onStop(function () {
    handle.stop();
  });
});

function prepareFamilyTreeData (id, db) {
  
  var root = People.findOne({
              familyId: id,
              isRoot: true
            },{
              fields: {
                name: 1,
                dob: 1,
                familyId: 1,
                children: 1,
                isRoot: 1
              }
            });
  var rootId = db.update({ _id: root._id } , root, { upsert: true });
  var tempFamily = db.find().fetch();
  
  tempFamily[0].children.forEach(function (doc) {
    loopThroughChild(root._id, doc, db);
  });
}

function loopThroughChild(parent, doc, db) {
  
  var child = People.find(
    { _id: doc, },
    { fields: {name: 1, dob: 1, familyId: 1, children: 1}
  }).fetch();

  var id = db.update({ _id: child[0]._id }, child[0], { upsert: true });

  if (child[0].children && child[0].children.length) {
    child[0].children.forEach(function (d) {
      loopThroughChild(child[0]._id, d, db);
    });
  }

  db.update({ _id: parent }, {
    $pull: { "children": child[0]._id },
    $push: { "children": db.findOne({ _id: child[0]._id }) }
  });
}