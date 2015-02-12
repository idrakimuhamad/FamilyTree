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
  var self = this;
  var initializing = true;
  var famObj = {};

  // Based on Meteor docs.

  // observeChanges only returns after the initial `added` callbacks
  // have run. Until then, we don't want to send a lot of
  // `self.changed()` messages - hence tracking the
  // `initializing` state.
  var handle = People.find({ familyId: familyId }).observeChanges({
    added: function (id, field) {
      var doc = field;
      doc._id = id;
      if (!initializing)
        self.added('people', doc._id, doc);
    },
    removed: function (id) {
      var doc = field;
      doc._id = id;
      self.changed("people", id, doc);
    }
  });

  initializing = false;

  People.find(
    { familyId: familyId },
    {
      fields: {name: 1, dob: 1, familyId: 1, children: 1, isRoot: 1 },
      sort: { dob: 1 }
    }
    ).forEach(function (doc) {
      childIntoChild(doc, self);
    });

  self.ready();

  self.onStop(function () {
    handle.stop();
  });
});

function childIntoChild (doc, self) {
  if (doc.children && doc.children.length) {
    doc.children =  People.find({_id: {$in: doc.children}}, {fields: {name: 1, dob: 1, familyId: 1, children: 1}}).fetch();
    self.added('people', doc._id, doc);
  } else if (doc.isRoot) {
    self.added('people', doc._id, doc);
  }
}