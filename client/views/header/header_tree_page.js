Template.header_tree_page.events({
  'change .tree-style': function (e, t) {
    var tree = t.find('.tree-style').value;
    Session.set('treeModel', tree);
  }
});