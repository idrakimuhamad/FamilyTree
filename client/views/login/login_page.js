Template.login_page.helpers({
  isLogin: function () {
    return Session.get('isLogin');
  }
});

Template.login_page.events({
  'click .signup': function (e) {
    e.preventDefault();
    Session.set('isLogin', false);
  },
  'click .login': function (e) {
    e.preventDefault();
    Session.set('isLogin', true);
  },
  'submit #signup': function (e, t) {
    e.preventDefault();

    Accounts.createUser({
      username: t.find('.username').value,
      password: t.find('.password').value,
      email: t.find('.email').value
    }, function (err, res) {
      if (err) alert('Oppps... There seems to be a problem. ' + err.reason);

      Router.go('/family');
    });
  },
  'submit #login': function (e, t) {
    e.preventDefault();

    Meteor.loginWithPassword(
      t.find('.username').value,
      t.find('.password').value,
      function (err) {
        if (err) alert('Oppps... There seems to be a problem. ' + err.reason);
        Router.go('/family');
      });
  }
});