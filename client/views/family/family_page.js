Template.family_page.helpers({
  isCreate: function () {
    return Session.get('isCreate');
  },
  noFamily: function () {
    return Family.find({ createdBy: Meteor.userId() }).count() == 0;
  },
  family: function () {
    return Family.find({ createdBy: Meteor.userId() });
  }
});

Template.family_page.events({
  'click .create': function (e) {
    e.preventDefault();
    Session.set('isCreate', true);
  }
});

Template.family_form.events({
  'submit #family': function (e, t) {
    e.preventDefault();

    var family = {
      name: t.find('.family').value
    };

    if (family.name) {
      Meteor.call('createFamily', family, function (err, res) {
        if (err) alert('Oppps... There seems to be a problem. ' + err.reason);
        Router.go('/family/' + res._id);
      });
    }
  }
});