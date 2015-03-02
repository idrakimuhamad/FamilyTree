
Template.family_tree_page.rendered = function () {
  Tracker.autorun(function () {
    if (People.find()) {
      if (Session.equals('treeModel', 'horizontal')) {
        createLinkFamilyTree('.tree', People.find().fetch()[0]);
      } else if (Session.equals('treeModel', 'vertical')) {
        createVerticalFamilyTree('.tree', People.find().fetch()[0]);
      }
    }
  });
};

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
    Session.set('selectedPerson', id);
    Session.set('selectedName', $(e.currentTarget).text());
    $('.menu').removeClass('hidden');
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

Template.menu.helpers({
  name: function () {
    return Session.get('selectedName');
  }
});

Template.menu.events({
  'focus form input': function (e, t) {
    $('.menu').addClass('focus');
  },
  'blur form input': function (e, t) {
    $('.menu').removeClass('focus');
  },
  'submit #child': function (e, t) {
    e.preventDefault();

    var people = {
      name: t.find('.child').value,
      dob: t.find('#child .dob').value,
      familyId: Session.get('currentTree'),
      isRoot: false
    };

    Meteor.call('addChild', people, Session.get('selectedPerson'), function (err, res) {
      if (err) alert('Oppps... There seems to be a problem. ' + err.reason);
      Tracker.flush();
      $('.menu').addClass('hidden');
      $('.menu').removeClass('focus');
      t.find('.child').value = '';
      t.find('.dob').value = '';
      Session.set('selectedPerson', null);
      Session.set('selectedName', null);
    });
  },
  'click .close': function (e) {
    $('.menu').addClass('hidden');
    $('.menu').removeClass('focus');
    Session.set('selectedPerson', null);
    Session.set('selectedName', null);
  }
});