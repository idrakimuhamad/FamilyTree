var selectedPerson;

Template.family_tree_page.helpers({
  family: function () {
    return Family.findOne({ _id: Session.get('currentTree') });
  },
  noPerson: function () {
    return People.find().count() == 0;
  },
  person: function () {
    return People.find();
  }
});

Template.family_tree_page.events({
  'click .person': function (e, t) {
    e.preventDefault();
    var id = $(e.currentTarget).data('id');
    selectedPerson = id;
    $('.menu').toggleClass('hidden');
  }
});

Template.create_root.events({
  'submit #root': function (e, t) {
    e.preventDefault();

    var people = {
      name: t.find('.root').value,
      dob: t.find('.dob').value,
      familyId: Session.get('currentTree'),
      isRoot: true,
      children: []
    };

    Meteor.call('createPeople', people, function (err, res) {
      if (err) alert('Oppps... There seems to be a problem. ' + err.reason);
      Tracker.flush();
    });
  }
});

Template.menu.events({
  'submit #child': function (e, t) {
    e.preventDefault();

    var people = {
      name: t.find('.child').value,
      dob: t.find('.dob').value,
      familyId: Session.get('currentTree'),
      isRoot: false,
      children: []
    };

    Meteor.call('addChild', people, selectedPerson, function (err, res) {
      if (err) alert('Oppps... There seems to be a problem. ' + err.reason);
      Tracker.flush();
    });
  }
});