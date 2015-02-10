Meteor.publish('family', function (userId) {
  return Family.find({ createdBy: userId });
});

Meteor.publish('peoplesInFamily', function (familyId) {
  var self = this;

  People.find(
    { familyId: familyId },
    { fields: {name: 1, dob: 1, familyId: 1, children: 1} }
    ).forEach(function (doc) {
      childIntoChild(doc, self);
    });

  self.ready();
});

function childIntoChild (doc, self) {
  if (doc.children.length) {
    doc.children =  People.find({_id: {$in: doc.children}}, {fields: {name: 1, dob: 1, familyId: 1, children: 1}}).fetch();
    self.added('people', doc._id, doc);
  }
}