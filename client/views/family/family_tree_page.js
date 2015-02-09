Template.family_tree_page.helpers({
  family: function () {
    return Family.findOne({ _id: Session.get('currentTree') });
  },
  noPerson: function () {
    return People.find().count() == 0;
  }
});

Template.create_root.events({
  'submit #root': function (e, t) {
    e.preventDefault();

    var people = {
      name: t.find('.root').value,
      dob: t.find('.dob').value,
      familyId: Session.get('currentTree'),
      isRoot: true
    };

    Meteor.call('createPeople', people, function (err, res) {
      if (err) alert('Oppps... There seems to be a problem. ' + err.reason);
      Tracker.flush();
    });
  }
});