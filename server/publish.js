Meteor.publish('family', function (userId) {
  return Family.find({ createdBy: userId });
});

Meteor.publish('peoplesInFamily', function (familyId) {
  return People.find({ familyId: familyId }, { 
    transform : function (doc) {
    }
  });
});