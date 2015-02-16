AppController = RouteController.extend({
  layoutTemplate: 'app_layout',

  action: function () {
    this.render();
  }
});

Router.route('/', {
  name: 'login_page',
  template: 'login_page',
  controller: 'AppController',
  onBeforeAction: function () {
    if (Meteor.user()) {
      Router.go('/family');
    };
    Session.set('isLogin', true);
    this.next();
  }
});

Router.route('/family/:_id', {
  name: 'family_tree_page',
  template: 'family_tree_page',
  controller: 'AppController',
  waitOn: function () {
    return [Meteor.subscribe('family', Meteor.userId()), Meteor.subscribe('peoplesInFamily', this.params._id)];
  },
  onBeforeAction: function () {
    Session.set('currentTree', this.params._id);
    Session.set('selectedPerson', null);
    Session.set('selectedName', null);
    this.next();
  }
});

Router.route('/family', {
  name: 'family_page',
  template: 'family_page',
  controller: 'AppController',
  waitOn: function () {
    return Meteor.subscribe('family', Meteor.userId());
  },
  onBeforeAction: function () {
    Session.set('isCreate', false);
    this.next();
  }
});