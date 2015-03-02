var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = $(window).width() - 120 - margin.right - margin.left,
    // height = 500 - margin.top - margin.bottom;
    height = 700 - margin.top - margin.bottom;

var i = 0,
    duration = 550,
    root, svg, tree, diagonal;

createLinkFamilyTree = function (selector, obj) {
  var data = obj;

  diagonal = d3.svg.diagonal()
              .projection(function(d) { return [d.y, d.x]; });

  tree = d3.layout.tree()
            .size([height, width]);

  // clean the element from any SVG before appending
  clearFamilyTree(selector);

  svg = d3.select(selector).append("svg")
      .attr("class", "horizontal-tree")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = data;
  root.x0 = height / 2;
  root.y0 = 0;

//  Collapse child by default
//  function collapse(d) {
//    if (d.children) {
//      d._children = d.children;
//      d._children.forEach(collapse);
//      d.children = null;
//    }
//  }

//  if (root.children) root.children.forEach(collapse);

  updateChilren(root);

  d3.select(self.frameElement).style("height", "800px");
}

updateChilren = function (source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d._id || (d._id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
      .on("click", click);

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
//        .attr("text-anchor", function(d) { return d.isRoot ? "end" : "start" })
      .attr("data-id", function(d) { return d._id })
      .attr("class", function(d) { return "person" })
      .text(function(d) { return d.spouse ? d.spouse + ' + ' + d.name : d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target._id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });


  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    updateChilren(d);
  }
}

createVerticalFamilyTree = function (selector, obj) {
  var data = obj,
      duration = 150;

  root = data;
  root.parent = root;
  root.px = 0;
  root.py = 0;

  tree = d3.layout.tree()
            .size([width - 20, height - 80]);

  // clean the element from any SVG before appending
  clearFamilyTree(selector);

  svg = d3.select(selector).append("svg")
    .attr("class", "vertical-tree")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + ",10)");

  diagonal = d3.svg.diagonal();

  updateVertical(root);
}

updateVertical = function (data) {
  var nodes = tree(root),
      node = svg.selectAll(".circle"),
      link = svg.selectAll(".link");

  // if (nodes.length >= 1000) return clearInterval(timer);

  // Recompute the layout and data join.
  node = node.data(tree.nodes(root), function(d) { return d._id; });
  link = link.data(tree.links(nodes), function(d) { return d.source._id + "-" + d.target._id; });

  // Add entering nodes in the parent’s old position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeEnter.append("circle")
      .attr("class", "circle")
      .attr("r", 4)
      .attr("cx", function(d) { return d.parent.y; })
      .attr("cy", function(d) { return d.parent.x; });
      // .on("click", click);

  // append name
  nodeEnter.append("text")
      .attr("x", function (d) { return d.children && !d.isRoot ? -10 : 10})
      .attr("dy", function (d) { return d.isRoot ? "0.5em" : "1.5em"})
      .attr("class", function(d) { return "person" })
      .attr("data-id", function(d) { return d._id })
      .attr("text-anchor", function(d) {
        return d.children && !d.isRoot ? "end" : "start";
      })
      .attr("transform",function(d) {
        return d.isRoot ? "" : "rotate(45)";
      })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Add entering links in the parent’s old position.
  link.enter().insert("path", ".node")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: d.source.x, y: d.source.y};
        return diagonal({source: o, target: o});
      });

  // Transition nodes and links to their new positions.
  var t = svg.transition()
      .duration(duration);

  t.selectAll("text")
      .style("fill-opacity", 1);

  t.selectAll(".link")
      .attr("d", diagonal);

  t.selectAll(".circle")
      .attr("cx", function(d) { return d.px; })
      .attr("cy", function(d) { return d.py; });

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: d.source.x, y: d.source.x};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.px = d.x;
    d.py = d.y;
  });

  // Toggle children on click.
  // function click(d) {
  //   if (d.children) {
  //     d._children = d.children;
  //     d.children = null;
  //   } else {
  //     d.children = d._children;
  //     d._children = null;
  //   }
  //   updateVertical(d);
  // }
}

clearFamilyTree = function (selector) {
  d3.select(selector + ' svg').remove();
}